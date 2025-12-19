// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

const { query } = require('../helpers/db.helper');

// GET /api/admin/enquiries (admin+teacher)
router.get('/enquiries', async (req, res) => {
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
    return res.status(500).json({ error: 'Failed to fetch enquiries', details: err.message });
  }
});

// GET /api/admin/students (admin only, but auth/role is already enforced in server.js)
router.get('/students', async (req, res) => {
  try {
    const sql = `
      SELECT
        id,
        child_name,
        class_name,
        age,
        parent_name,
        phone,
        address,
        created_by_role,
        created_by_username,
        created_at
      FROM students
      ORDER BY created_at DESC
    `;
    const result = await query(sql);
    return res.json(result.rows || []);
  } catch (err) {
    console.error('[admin.routes] Error fetching students:', err.message);
    return res.status(500).json({ error: 'Failed to fetch students', details: err.message });
  }
});

module.exports = router;