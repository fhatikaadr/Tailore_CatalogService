const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table for authentication
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err.message);
        else console.log('✓ Users table created');
      });

      // Products table (catalog)
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          brand TEXT,
          category TEXT,
          retail_price REAL NOT NULL,
          price_per_week REAL,
          price_per_month REAL,
          color TEXT,
          size TEXT,
          material TEXT,
          gender TEXT,
          occasion TEXT,
          season TEXT,
          length TEXT,
          details TEXT,
          outfit_tags TEXT,
          tag_categories TEXT,
          owner TEXT,
          group_id TEXT,
          time_created DATETIME,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating products table:', err.message);
        else console.log('✓ Products table created');
      });

      // Inventory table (stock management)
      db.run(`
        CREATE TABLE IF NOT EXISTS inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id TEXT NOT NULL,
          quantity INTEGER DEFAULT 0,
          reserved_quantity INTEGER DEFAULT 0,
          available_quantity INTEGER DEFAULT 0,
          warehouse_location TEXT,
          last_restocked DATETIME,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating inventory table:', err.message);
        else console.log('✓ Inventory table created');
      });

      // Stock history table (audit trail)
      db.run(`
        CREATE TABLE IF NOT EXISTS stock_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id TEXT NOT NULL,
          action TEXT NOT NULL,
          quantity_change INTEGER NOT NULL,
          previous_quantity INTEGER,
          new_quantity INTEGER,
          reason TEXT,
          performed_by TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating stock_history table:', err.message);
        else console.log('✓ Stock history table created');
        resolve();
      });
    });
  });
};

// Initialize database
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('\n✅ Database initialized successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Database initialization failed:', err);
      process.exit(1);
    });
}

module.exports = { createTables };
