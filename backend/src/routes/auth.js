const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authenticate = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../validators/auth');

const router = express.Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post('/register', registerValidator, async (req, res) => {
  let { name, email, phone, password } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        code: 'EMAIL_EXISTS',
        field: 'email',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name.trim(), email, phone.trim(), hashedPassword]
    );

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [result.insertId]
    );

    const user = rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to CRM!',
      data: {
        token,
        user: safeUser(user),
      },
    });
  } catch (err) {
    console.error('[Register Error]', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        code: 'EMAIL_EXISTS',
        field: 'email',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error. Please try again.',
      code: 'SERVER_ERROR',
    });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post('/login', loginValidator, async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      data: {
        token,
        user: safeUser(user),
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to a server error. Please try again.',
      code: 'SERVER_ERROR',
    });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User data fetched successfully.',
      data: {
        user: rows[0],
      },
    });
  } catch (err) {
    console.error('[Me Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user data.',
      code: 'SERVER_ERROR',
    });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

router.post('/logout', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

module.exports = router;
