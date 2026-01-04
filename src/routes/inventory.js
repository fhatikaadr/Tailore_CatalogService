const express = require('express');
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/inventory/stock:
 *   get:
 *     summary: Get inventory status for all products
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filter low stock items (≤10)
 *       - in: query
 *         name: outOfStock
 *         schema:
 *           type: boolean
 *         description: Filter out of stock items
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized - JWT token required
 */
router.get('/stock', authenticate, (req, res) => {
  const {
    page = 1,
    limit = 100,
    lowStock = false,
    outOfStock = false
  } = req.query;

  const offset = (page - 1) * limit;
  let query = `
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
  `;

  const params = [];

  // REMOVED FILTERS - Show all products regardless of stock status
  // This prevents products from disappearing after stock updates

  // Get total count
  const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
  
  db.get(countQuery, params, (err, countResult) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    const total = countResult.total;

    // Add ordering and pagination
    query += ` ORDER BY i.available_quantity ASC, p.name LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    db.all(query, params, (err, inventory) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      console.log('📦 Inventory query result:', {
        count: inventory.length,
        total,
        sample: inventory.length > 0 ? inventory[0].name : 'empty'
      });

      res.json({
        success: true,
        data: inventory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    });
  });
});

/**
 * @swagger
 * /api/inventory/stock/{productId}:
 *   get:
 *     summary: Get inventory for specific product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Inventory retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory not found
 *       401:
 *         description: Unauthorized
 */
router.get('/stock/:productId', authenticate, (req, res) => {
  const { productId } = req.params;

  db.get(
    `SELECT 
      i.*,
      p.name,
      p.brand,
      p.category
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    WHERE i.product_id = ?`,
    [productId],
    (err, inventory) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory not found for this product'
        });
      }

      res.json({
        success: true,
        data: inventory
      });
    }
  );
});

/**
 * @swagger
 * /api/inventory/stock/{productId}/adjust:
 *   post:
 *     summary: Adjust stock quantity (Admin only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *                 description: Quantity to add (positive) or remove (negative)
 *               reason:
 *                 type: string
 *                 example: Manual adjustment
 *     responses:
 *       200:
 *         description: Stock adjusted successfully
 *       400:
 *         description: Invalid quantity
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/stock/:productId/adjust', authenticate, authorize('admin'), (req, res) => {
  const { productId } = req.params;
  const { quantity, reason = 'Manual adjustment' } = req.body;

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({
      success: false,
      message: 'Quantity is required'
    });
  }

  const quantityChange = parseInt(quantity);

  // Get current inventory
  db.get(
    'SELECT * FROM inventory WHERE product_id = ?',
    [productId],
    (err, inventory) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory not found'
        });
      }

      const previousQuantity = inventory.quantity;
      const newQuantity = previousQuantity + quantityChange;

      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Resulting quantity cannot be negative'
        });
      }

      const newAvailable = newQuantity - inventory.reserved_quantity;

      // Update inventory
      db.run(
        `UPDATE inventory 
         SET quantity = ?, 
             available_quantity = ?,
             last_restocked = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE product_id = ?`,
        [newQuantity, newAvailable, productId],
        function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to update inventory',
              error: err.message
            });
          }

          // Record in stock history
          db.run(
            `INSERT INTO stock_history 
             (product_id, action, quantity_change, previous_quantity, new_quantity, reason, performed_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              productId,
              quantityChange > 0 ? 'RESTOCK' : 'REDUCE',
              quantityChange,
              previousQuantity,
              newQuantity,
              reason,
              req.user.username
            ],
            (err) => {
              if (err) {
                console.error('Error recording stock history:', err.message);
              }

              res.json({
                success: true,
                message: 'Stock adjusted successfully',
                data: {
                  product_id: productId,
                  previous_quantity: previousQuantity,
                  quantity_change: quantityChange,
                  new_quantity: newQuantity,
                  available_quantity: newAvailable
                }
              });
            }
          );
        }
      );
    }
  );
});

/**
 * @route   POST /api/inventory/stock/:productId/reserve
 * @desc    Reserve stock for an order
 * @access  Private
 */
router.post('/stock/:productId/reserve', authenticate, (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid quantity is required'
    });
  }

  const reserveQty = parseInt(quantity);

  // Get current inventory
  db.get(
    'SELECT * FROM inventory WHERE product_id = ?',
    [productId],
    (err, inventory) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory not found'
        });
      }

      if (inventory.available_quantity < reserveQty) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available',
          data: {
            requested: reserveQty,
            available: inventory.available_quantity
          }
        });
      }

      const newReserved = inventory.reserved_quantity + reserveQty;
      const newAvailable = inventory.available_quantity - reserveQty;

      // Update inventory
      db.run(
        `UPDATE inventory 
         SET reserved_quantity = ?,
             available_quantity = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE product_id = ?`,
        [newReserved, newAvailable, productId],
        function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to reserve stock',
              error: err.message
            });
          }

          // Record in history
          db.run(
            `INSERT INTO stock_history 
             (product_id, action, quantity_change, previous_quantity, new_quantity, reason, performed_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              productId,
              'RESERVE',
              -reserveQty,
              inventory.available_quantity,
              newAvailable,
              'Stock reserved for order',
              req.user.username
            ]
          );

          res.json({
            success: true,
            message: 'Stock reserved successfully',
            data: {
              product_id: productId,
              reserved_quantity: reserveQty,
              new_reserved_total: newReserved,
              available_quantity: newAvailable
            }
          });
        }
      );
    }
  );
});

/**
 * @route   POST /api/inventory/stock/:productId/release
 * @desc    Release reserved stock
 * @access  Private
 */
router.post('/stock/:productId/release', authenticate, (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid quantity is required'
    });
  }

  const releaseQty = parseInt(quantity);

  // Get current inventory
  db.get(
    'SELECT * FROM inventory WHERE product_id = ?',
    [productId],
    (err, inventory) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory not found'
        });
      }

      if (inventory.reserved_quantity < releaseQty) {
        return res.status(400).json({
          success: false,
          message: 'Cannot release more than reserved quantity',
          data: {
            requested: releaseQty,
            reserved: inventory.reserved_quantity
          }
        });
      }

      const newReserved = inventory.reserved_quantity - releaseQty;
      const newAvailable = inventory.available_quantity + releaseQty;

      // Update inventory
      db.run(
        `UPDATE inventory 
         SET reserved_quantity = ?,
             available_quantity = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE product_id = ?`,
        [newReserved, newAvailable, productId],
        function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to release stock',
              error: err.message
            });
          }

          // Record in history
          db.run(
            `INSERT INTO stock_history 
             (product_id, action, quantity_change, previous_quantity, new_quantity, reason, performed_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              productId,
              'RELEASE',
              releaseQty,
              inventory.available_quantity,
              newAvailable,
              'Stock released from reservation',
              req.user.username
            ]
          );

          res.json({
            success: true,
            message: 'Stock released successfully',
            data: {
              product_id: productId,
              released_quantity: releaseQty,
              new_reserved_total: newReserved,
              available_quantity: newAvailable
            }
          });
        }
      );
    }
  );
});

/**
 * @route   POST /api/inventory/stock/:productId/commit
 * @desc    Commit reserved stock (finalize sale)
 * @access  Private
 */
router.post('/stock/:productId/commit', authenticate, (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid quantity is required'
    });
  }

  const commitQty = parseInt(quantity);

  // Get current inventory
  db.get(
    'SELECT * FROM inventory WHERE product_id = ?',
    [productId],
    (err, inventory) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory not found'
        });
      }

      if (inventory.reserved_quantity < commitQty) {
        return res.status(400).json({
          success: false,
          message: 'Cannot commit more than reserved quantity',
          data: {
            requested: commitQty,
            reserved: inventory.reserved_quantity
          }
        });
      }

      const newReserved = inventory.reserved_quantity - commitQty;
      const newTotal = inventory.quantity - commitQty;

      // Update inventory (reduce total and reserved)
      db.run(
        `UPDATE inventory 
         SET quantity = ?,
             reserved_quantity = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE product_id = ?`,
        [newTotal, newReserved, productId],
        function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to commit stock',
              error: err.message
            });
          }

          // Record in history
          db.run(
            `INSERT INTO stock_history 
             (product_id, action, quantity_change, previous_quantity, new_quantity, reason, performed_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              productId,
              'COMMIT',
              -commitQty,
              inventory.quantity,
              newTotal,
              'Stock committed - sale finalized',
              req.user.username
            ]
          );

          res.json({
            success: true,
            message: 'Stock committed successfully',
            data: {
              product_id: productId,
              committed_quantity: commitQty,
              new_total_quantity: newTotal,
              new_reserved: newReserved,
              available_quantity: inventory.available_quantity
            }
          });
        }
      );
    }
  );
});

/**
 * @route   GET /api/inventory/history/:productId
 * @desc    Get stock history for a product
 * @access  Private
 */
router.get('/history/:productId', authenticate, (req, res) => {
  const { productId } = req.params;
  const { limit = 50 } = req.query;

  db.all(
    `SELECT * FROM stock_history 
     WHERE product_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [productId, parseInt(limit)],
    (err, history) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      res.json({
        success: true,
        data: history
      });
    }
  );
});

/**
 * @route   GET /api/inventory/alerts
 * @desc    Get low stock and out of stock alerts
 * @access  Private (Admin)
 */
router.get('/alerts', authenticate, authorize('admin'), (req, res) => {
  const queries = {
    totalProducts: `
      SELECT COUNT(*) as count
      FROM inventory i
      JOIN products p ON i.product_id = p.id
    `,
    outOfStock: `
      SELECT p.id, p.name, p.brand, p.category, i.quantity, i.available_quantity
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.available_quantity = 0
      ORDER BY p.name
    `,
    lowStock: `
      SELECT p.id, p.name, p.brand, p.category, i.quantity, i.available_quantity
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.available_quantity > 0 AND i.available_quantity <= 10
      ORDER BY i.available_quantity ASC, p.name
    `
  };

  const results = {};
  let completed = 0;

  Object.keys(queries).forEach(key => {
    db.all(queries[key], [], (err, rows) => {
      if (!err) {
        results[key] = rows;
      } else {
        results[key] = [];
      }
      completed++;

      if (completed === Object.keys(queries).length) {
        res.json({
          success: true,
          data: results,
          summary: {
            totalProducts: results.totalProducts && results.totalProducts[0] ? results.totalProducts[0].count : 0,
            outOfStockCount: results.outOfStock.length,
            lowStockCount: results.lowStock.length
          }
        });
      }
    });
  });
});

module.exports = router;
