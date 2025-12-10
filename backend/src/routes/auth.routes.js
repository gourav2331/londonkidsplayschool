// backend/src/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  TEACHER_USERNAME,
  TEACHER_PASSWORD,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = process.env;

if (!JWT_SECRET) {
  console.warn('[auth.routes] JWT_SECRET not set – tokens will not be secure.');
}

router.post('/login', (req, res) => {
  const { username, password, role } = req.body || {};

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'username, password and role are required' });
  }

  let valid = false;

  if (role === 'admin') {
    valid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  } else if (role === 'teacher') {
    valid = username === TEACHER_USERNAME && password === TEACHER_PASSWORD;
  } else {
    return res.status(400).json({ error: 'Unsupported role' });
  }

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = {
    sub: username,
    role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '7d',
  });

  return res.json({
    token,
    role,
    username,
  });
});

module.exports = router;
