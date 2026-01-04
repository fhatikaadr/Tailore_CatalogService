const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tailoré Catalog & Inventory API',
      version: '1.0.0',
      description: 'API Documentation for Tailoré E-Commerce Catalog and Inventory Management System',
      contact: {
        name: 'Tailoré Team',
        email: 'support@tailore.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Classic Cotton T-Shirt' },
            description: { type: 'string', example: 'Comfortable cotton t-shirt' },
            brand: { type: 'string', example: 'Nike' },
            category: { type: 'string', example: 'Tops' },
            gender: { type: 'string', enum: ['Men', 'Women', 'Unisex'], example: 'Men' },
            size: { type: 'string', example: 'M' },
            color: { type: 'string', example: 'Blue' },
            retail_price: { type: 'number', format: 'float', example: 29.99 },
            cost_price: { type: 'number', format: 'float', example: 15.00 },
            season: { type: 'string', example: 'Summer' },
            occasion: { type: 'string', example: 'Casual' },
            material: { type: 'string', example: 'Cotton' },
            care_instructions: { type: 'string', example: 'Machine wash cold' },
            image_url: { type: 'string', example: 'https://example.com/image.jpg' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Inventory: {
          type: 'object',
          properties: {
            product_id: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 100 },
            available_quantity: { type: 'integer', example: 95 },
            reserved_quantity: { type: 'integer', example: 5 },
            warehouse_location: { type: 'string', example: 'A-12-3' },
            last_restocked: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Detailed error description' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Catalog',
        description: 'Product catalog management'
      },
      {
        name: 'Inventory',
        description: 'Inventory management'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
