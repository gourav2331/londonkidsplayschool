// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

const { query } = require('../helpers/db.helper');
const { authRequired, requireRole } = require('../middleware/auth.middleware');

// GET /api/admin/enquiries
router.get(
  '/enquiries',
  authRequired,
  requireRole(['admin', 'teacher']),
  async (req, res) => {
    try {
      const sql = `
        SELECT
          id,
          parent_name,
          phone,
          email,
          child_name,
          child_age,
          class_applied_for,
          source,
          message,
          created_at
        FROM enquiries
        ORDER BY created_at DESC
      `;

      const result = await query(sql);
      return res.json(result.rows || []);
    } catch (err) {
      console.error('[admin.routes] Error fetching enquiries:', err.message);
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
  }
);

module.exports = router;
