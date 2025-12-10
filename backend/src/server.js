// backend/src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const enquiryRoutes = require('./routes/enquiry.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const teacherRoutes = require('./routes/teacher.routes');
const { authRequired, requireRole } = require('./middleware/auth.middleware');

const app = express();

const PORT = process.env.PORT || 8000;
// Frontend via Nginx on 4500
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4500';

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(morgan('combined'));

// Health
app.get('/api/health', (req, res) => {
  res.json({ service: 'playschool-backend', status: 'ok' });
});

// Public enquiries (contact / appointment forms)
app.use('/api/enquiries', enquiryRoutes);

// Auth (login)
app.use('/api/auth', authRoutes);

// Admin (protected, admin only)
app.use('/api/admin', authRequired, requireRole(['admin']), adminRoutes);

// Teacher (protected: teacher sees own data, admin can also use for debugging)
app.use(
  '/api/teacher',
  authRequired,
  requireRole(['teacher', 'admin']),
  teacherRoutes
);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
