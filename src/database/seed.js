const db = require('../config/database');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const { createTables } = require('./init');

// Parse CSV and seed database
const seedDatabase = async () => {
  try {
    // First, create tables
    await createTables();

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.run(`
      INSERT OR IGNORE INTO users (username, password, role)
      VALUES (?, ?, ?)
    `, ['admin', hashedPassword, 'admin'], (err) => {
      if (err) console.error('Error creating admin user:', err.message);
      else console.log('✓ Admin user created (username: admin, password: admin123)');
    });

    // Create regular user for testing
    const userPassword = await bcrypt.hash('user123', 10);
    db.run(`
      INSERT OR IGNORE INTO users (username, password, role)
      VALUES (?, ?, ?)
    `, ['user', userPassword, 'user'], (err) => {
      if (err) console.error('Error creating test user:', err.message);
      else console.log('✓ Test user created (username: user, password: user123)');
    });

    // Read and parse CSV file
    const csvPath = process.env.CSV_PATH || path.join(__dirname, '../../../outfits.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at: ${csvPath}`);
      console.log('Please make sure outfits.csv is in the correct location.');
      process.exit(1);
    }

    console.log(`\n📁 Reading CSV from: ${csvPath}`);
    
    const products = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          // Parse tags
          let tags = [];
          let categories = [];
          
          try {
            if (row.outfit_tags) {
              tags = row.outfit_tags.replace(/[\[\]']/g, '').split(',').map(t => t.trim());
            }
            if (row.tag_categories) {
              categories = row.tag_categories.replace(/[\[\]']/g, '').split(',').map(t => t.trim());
            }
          } catch (e) {
            // Skip parsing errors
          }

          // Extract key attributes from tags
          const brand = tags.find((t, i) => categories[i] === 'Brand') || '';
          const color = tags.find((t, i) => categories[i] === 'Color') || '';
          const size = tags.find((t, i) => categories[i] === 'Size') || '';
          const material = tags.filter((t, i) => categories[i] === 'Material').join(', ');
          const category = tags.find((t, i) => categories[i] === 'Category') || '';
          const gender = tags.find((t, i) => categories[i] === 'Gender') || '';
          const occasion = tags.find((t, i) => categories[i] === 'Occasion') || '';
          const season = tags.filter((t, i) => categories[i] === 'Seasons').join(', ');
          const length = tags.find((t, i) => categories[i] === 'Length') || '';
          const details = tags.find((t, i) => categories[i] === 'Details') || '';

          // Generate unique fashion/clothing images using LoremFlickr
          // LoremFlickr provides real photos based on keywords
          const clothingKeywords = [
            'dress', 'shirt', 'pants', 'jacket', 'skirt', 'shoes',
            'fashion', 'clothing', 'apparel', 'outfit', 'style'
          ];
          
          // Select keyword based on product category or name
          let keyword = 'fashion,clothing';
          const nameWords = row.name.toLowerCase();
          
          if (nameWords.includes('dress')) keyword = 'dress,fashion';
          else if (nameWords.includes('shirt') || nameWords.includes('blouse')) keyword = 'shirt,fashion';
          else if (nameWords.includes('pants') || nameWords.includes('jeans')) keyword = 'pants,fashion';
          else if (nameWords.includes('skirt')) keyword = 'skirt,fashion';
          else if (nameWords.includes('jacket')) keyword = 'jacket,fashion';
          else if (nameWords.includes('shoes')) keyword = 'shoes,fashion';
          else if (category) keyword = `${category.toLowerCase()},fashion`;
          
          // Use LoremFlickr with unique seed based on product ID
          const seed = Math.abs(row.id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
          const imageUrl = `https://loremflickr.com/300/400/${keyword}?random=${seed}`;

          products.push({
            id: row.id,
            name: row.name,
            description: row.description,
            brand,
            category,
            retail_price: parseFloat(row.retailPrice) || 0,
            price_per_week: parseFloat(row.pricePerWeek) || 0,
            price_per_month: parseFloat(row.pricePerMonth) || 0,
            color,
            size,
            material,
            gender,
            occasion,
            season,
            length,
            details,
            outfit_tags: row.outfit_tags,
            tag_categories: row.tag_categories,
            owner: row.owner,
            group_id: row.group,
            time_created: row.timeCreated,
            image_url: imageUrl
          });
        })
        .on('end', () => {
          console.log(`✓ Parsed ${products.length} products from CSV`);
          resolve();
        })
        .on('error', reject);
    });

    // Insert products
    console.log('\n📦 Inserting products into database...');
    let insertedCount = 0;
    
    for (const product of products) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO products (
            id, name, description, brand, category,
            retail_price, price_per_week, price_per_month,
            color, size, material, gender, occasion, season, length, details,
            outfit_tags, tag_categories, owner, group_id, time_created, image_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product.id, product.name, product.description, product.brand, product.category,
          product.retail_price, product.price_per_week, product.price_per_month,
          product.color, product.size, product.material, product.gender,
          product.occasion, product.season, product.length, product.details,
          product.outfit_tags, product.tag_categories, product.owner,
          product.group_id, product.time_created, product.image_url
        ], (err) => {
          if (err) {
            console.error(`Error inserting product ${product.id}:`, err.message);
            reject(err);
          } else {
            insertedCount++;
            
            // Create inventory entry with random stock
            const initialStock = Math.floor(Math.random() * 50) + 1; // 1-50 items
            db.run(`
              INSERT OR REPLACE INTO inventory (product_id, quantity, reserved_quantity, available_quantity)
              VALUES (?, ?, 0, ?)
            `, [product.id, initialStock, initialStock], (err) => {
              if (err) console.error(`Error creating inventory for ${product.id}:`, err.message);
              resolve();
            });
          }
        });
      });
    }

    console.log(`✓ Inserted ${insertedCount} products`);
    console.log('\n✅ Database seeded successfully!');
    console.log('\n🔐 Default credentials:');
    console.log('   Admin - username: admin, password: admin123');
    console.log('   User  - username: user, password: user123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n🎉 Setup complete!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
