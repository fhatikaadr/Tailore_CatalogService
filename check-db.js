const db = require('./src/config/database');

db.all('SELECT id, name, image_url FROM products LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Sample products with images:');
    rows.forEach(row => {
      console.log(`\nID: ${row.id}`);
      console.log(`Name: ${row.name}`);
      console.log(`Image URL: ${row.image_url}`);
    });
  }
  process.exit(0);
});
