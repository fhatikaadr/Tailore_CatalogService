const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/catalog/products
 * @desc    Get all products with filters and pagination
 * @access  Public
 */
router.get('/products', (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      brand,
      category,
      color,
      size,
      minPrice,
      maxPrice,
      gender,
      occasion,
      season,
      inStock
    } = req.query;

    const offset = (page - 1) * limit;
    let query = `
      SELECT p.*, 
             i.quantity, 
             i.available_quantity,
             i.reserved_quantity
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE 1=1
    `;
    
    const params = [];

    // Apply filters
    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (brand) {
      query += ` AND p.brand = ?`;
      params.push(brand);
    }

    if (category) {
      query += ` AND p.category = ?`;
      params.push(category);
    }

    if (color) {
      query += ` AND p.color = ?`;
      params.push(color);
    }

    if (size) {
      query += ` AND p.size = ?`;
      params.push(size);
    }

    if (gender) {
      query += ` AND p.gender = ?`;
      params.push(gender);
    }

    if (occasion) {
      query += ` AND p.occasion LIKE ?`;
      params.push(`%${occasion}%`);
    }

    if (season) {
      query += ` AND p.season LIKE ?`;
      params.push(`%${season}%`);
    }

    if (minPrice) {
      query += ` AND p.retail_price >= ?`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ` AND p.retail_price <= ?`;
      params.push(parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      query += ` AND i.available_quantity > 0`;
    }

    // Get total count - Build separate count query
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE 1=1
    `;
    
    const countParams = [];

    // Apply same filters to count query
    if (search) {
      countQuery += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (brand) {
      countQuery += ` AND p.brand = ?`;
      countParams.push(brand);
    }

    if (category) {
      countQuery += ` AND p.category = ?`;
      countParams.push(category);
    }

    if (color) {
      countQuery += ` AND p.color = ?`;
      countParams.push(color);
    }

    if (size) {
      countQuery += ` AND p.size = ?`;
      countParams.push(size);
    }

    if (gender) {
      countQuery += ` AND p.gender = ?`;
      countParams.push(gender);
    }

    if (occasion) {
      countQuery += ` AND p.occasion LIKE ?`;
      countParams.push(`%${occasion}%`);
    }

    if (season) {
      countQuery += ` AND p.season LIKE ?`;
      countParams.push(`%${season}%`);
    }

    if (minPrice) {
      countQuery += ` AND p.retail_price >= ?`;
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countQuery += ` AND p.retail_price <= ?`;
      countParams.push(parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      countQuery += ` AND i.available_quantity > 0`;
    }
    
    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      console.log('📊 COUNT RESULT:', countResult);
      
      const total = countResult.total;
      const maxPages = 10; // Limit to 10 pages
      const maxProducts = maxPages * parseInt(limit); // 10 pages * 12 = 120 products
      const limitedTotal = Math.min(total, maxProducts);
      const calculatedTotalPages = Math.min(Math.ceil(limitedTotal / limit), maxPages);
      
      console.log('📊 PAGINATION CALCULATION:');
      console.log(`Total products in DB: ${total}`);
      console.log(`Limited to: ${limitedTotal} products`);
      console.log(`Limit per page: ${limit}`);
      console.log(`Calculated pages: ${calculatedTotalPages}`);
      console.log(`Current page: ${page}`);

      // Add pagination
      query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      // Get products
      db.all(query, params, (err, products) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        res.json({
          success: true,
          data: products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: limitedTotal,
            totalPages: calculatedTotalPages
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/catalog/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/products/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT p.*, 
            i.quantity, 
            i.available_quantity,
            i.reserved_quantity,
            i.warehouse_location,
            i.last_restocked
     FROM products p
     LEFT JOIN inventory i ON p.id = i.product_id
     WHERE p.id = ?`,
    [id],
    (err, product) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    }
  );
});

/**
 * @route   GET /api/catalog/filters
 * @desc    Get available filter options
 * @access  Public
 */
router.get('/filters', (req, res) => {
  const queries = {
    brands: 'SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand != "" ORDER BY brand',
    categories: 'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != "" ORDER BY category',
    colors: 'SELECT DISTINCT color FROM products WHERE color IS NOT NULL AND color != "" ORDER BY color',
    sizes: 'SELECT DISTINCT size FROM products WHERE size IS NOT NULL AND size != "" ORDER BY size',
    genders: 'SELECT DISTINCT gender FROM products WHERE gender IS NOT NULL AND gender != "" ORDER BY gender'
  };

  const results = {};
  let completed = 0;

  Object.keys(queries).forEach(key => {
    db.all(queries[key], [], (err, rows) => {
      if (!err) {
        results[key] = rows.map(row => Object.values(row)[0]);
      }
      completed++;

      if (completed === Object.keys(queries).length) {
        res.json({
          success: true,
          data: results
        });
      }
    });
  });
});

/**
 * @route   POST /api/catalog/products
 * @desc    Create a new product (Admin only)
 * @access  Private (Admin)
 */
router.post('/products', authenticate, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const {
    id,
    name,
    description,
    brand,
    category,
    retail_price,
    price_per_week,
    price_per_month,
    color,
    size,
    material,
    gender,
    occasion,
    season,
    length,
    details,
    initial_stock = 0
  } = req.body;

  // Validation
  if (!id || !name || !retail_price) {
    return res.status(400).json({
      success: false,
      message: 'Product ID, name, and retail price are required'
    });
  }

  db.run(
    `INSERT INTO products (
      id, name, description, brand, category,
      retail_price, price_per_week, price_per_month,
      color, size, material, gender, occasion, season, length, details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, name, description, brand, category,
      retail_price, price_per_week, price_per_month,
      color, size, material, gender, occasion, season, length, details
    ],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({
            success: false,
            message: 'Product ID already exists'
          });
        }
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      // Create inventory entry
      db.run(
        'INSERT INTO inventory (product_id, quantity, available_quantity) VALUES (?, ?, ?)',
        [id, initial_stock, initial_stock],
        (err) => {
          if (err) {
            console.error('Error creating inventory:', err.message);
          }

          res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { id, name, retail_price, initial_stock }
          });
        }
      );
    }
  );
});

/**
 * @route   PUT /api/catalog/products/:id
 * @desc    Update product (Admin only)
 * @access  Private (Admin)
 */
router.put('/products/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { id } = req.params;
  const updates = req.body;
  
  // Remove fields that shouldn't be updated
  delete updates.id;
  delete updates.created_at;

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update'
    });
  }

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  values.push(id);

  db.run(
    `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully'
      });
    }
  );
});

/**
 * @route   DELETE /api/catalog/products/:id
 * @desc    Delete product (Admin only)
 * @access  Private (Admin)
 */
router.delete('/products/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  });
});

module.exports = router;
