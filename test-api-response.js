const axios = require('axios');

async function testAPI() {
  try {
    const response = await axios.get('http://localhost:3001/api/catalog/products?limit=2');
    console.log('API Response:');
    console.log(JSON.stringify(response.data.data.products[0], null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

testAPI();
