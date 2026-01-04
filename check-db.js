const db = require('./src/config/database');

// Check products
db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
  if (err) console.error('Products error:', err);
  else console.log('Products count:', row.count);
});

// Check inventory
db.get('SELECT COUNT(*) as count FROM inventory', (err, row) => {
  if (err) console.error('Inventory error:', err);
  else console.log('Inventory count:', row.count);
  
  if (row && row.count === 0) {
    console.log('\n⚠️  Inventory is empty! Running seed...');
  }
  
  setTimeout(() => process.exit(0), 1000);
});
