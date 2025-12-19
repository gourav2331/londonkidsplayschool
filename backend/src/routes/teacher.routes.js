// backend/src/routes/teacher.routes.js
const express = require('express');
const router = express.Router();

const { query } = require('../helpers/db.helper');

// GET /api/teacher/students
//  - teacher → only their own students (created_by_role='teacher', created_by_username = JWT.sub)
//  - admin   → all students
router.get('/students', async (req, res) => {
  try {
    const user = req.user || {}; // { sub, role, iat, exp }

    if (!user.role) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    console.log('[teacher.routes] GET /students for user:', user);

    let sql = `
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
    `;
    const params = [];

    if (user.role === 'teacher') {
      sql += ' WHERE created_by_role = $1 AND created_by_username = $2';
      params.push('teacher', user.sub);
    }

    sql += ' ORDER BY created_at DESC';

    const { rows } = await query(sql, params);
    return res.json(rows || []);
  } catch (err) {
    console.error('[teacher.routes] Error fetching students:', err);
    return res.status(500).json({
      error: 'Failed to fetch students',
      details: err.message,
    });
  }
});

// POST /api/teacher/students
// Teacher (or admin) creates a new student
router.post('/students', async (req, res) => {
  try {
    const user = req.user || {};
    if (!user.role) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const {
      child_name,
      class_name,
      age,
      parent_name,
      phone,
      address,
    } = req.body || {};

    if (!child_name || !class_name || !phone) {
      return res.status(400).json({
        error: 'child_name, class_name and phone are required',
      });
    }

    // Option A: allow decimal age (NUMERIC(4,1) in DB)
    // Normalize: accept "2.3", 2.3, "2", 2, "" -> null
    const ageNum =
      age === undefined || age === null || age === ''
        ? null
        : Number(age);

    if (ageNum !== null && Number.isNaN(ageNum)) {
      return res.status(400).json({ error: 'age must be a number' });
    }

    console.log('[teacher.routes] POST /students by user:', user);

    const sql = `
      INSERT INTO students (
        child_name,
        class_name,
        age,
        parent_name,
        phone,
        address,
        created_by_role,
        created_by_username
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const params = [
      child_name,
      class_name,
      ageNum,
      parent_name ?? null,
      phone,
      address ?? null,
      user.role,
      user.sub,
    ];

    const { rows } = await query(sql, params);
    return res.status(201).json({ id: rows[0].id });
  } catch (err) {
    console.error('[teacher.routes] Error creating student:', err);
    return res.status(500).json({
      error: 'Failed to create student',
      details: err.message,
    });
  }
});

module.exports = router;