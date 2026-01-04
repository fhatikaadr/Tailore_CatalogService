const db = require('./src/config/database');

console.log('Testing inventory query...\n');

const query = `
  SELECT 
    p.id,
    p.name,
    p.brand,
    p.category,
    p.size,
    p.color,
    i.quantity,
    i.available_quantity,
    i.reserved_quantity,
    i.warehouse_location,
    i.last_restocked,
    i.updated_at
  FROM inventory i
  JOIN products p ON i.product_id = p.id
  WHERE 1=1
  ORDER BY i.available_quantity ASC, p.name
  LIMIT 5
`;

db.all(query, [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Found', rows.length, 'inventory items:');
    console.log(JSON.stringify(rows, null, 2));
  }
  process.exit(0);
});
