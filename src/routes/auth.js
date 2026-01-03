const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const jwtConfig = require('../config/jwt');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({
              success: false,
              message: 'Username already exists'
            });
          }
          throw err;
        }

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: {
            id: this.lastID,
            username,
            role
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role
          },
          jwtConfig.secret,
          { expiresIn: jwtConfig.expiresIn }
        );

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user.id,
              username: user.username,
              role: user.role
            }
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    db.get(
      'SELECT id, username, role, created_at FROM users WHERE id = ?',
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          data: user
        });
      }
    );
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
