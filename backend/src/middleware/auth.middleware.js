// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.warn('[auth.middleware] JWT_SECRET is not set. Auth will not work properly.');
}

function authRequired(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, role, iat, exp }
    next();
  } catch (err) {
    console.error('[auth.middleware] Invalid token:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    if (!roles.length || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  };
}

module.exports = {
  authRequired,
  requireRole,
};
