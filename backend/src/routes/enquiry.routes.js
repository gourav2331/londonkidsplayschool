// backend/src/routes/enquiry.routes.js
const express = require('express');
const router = express.Router();

const { query } = require('../helpers/db.helper');
const { sendEnquiryNotifications } = require('../services/notification.service');

// POST /api/enquiries
router.post('/', async (req, res) => {
  const {
    parent_name,
    phone,
    email = null,
    message = null,
    child_name = null,
    child_age = null,
    class_applied_for = null,
    source = 'contact',
  } = req.body || {};

  if (!parent_name || !phone) {
    return res.status(400).json({ error: 'parent_name and phone are required' });
  }

  try {
    const insertSql = `
      INSERT INTO enquiries (
        parent_name,
        phone,
        email,
        message,
        child_name,
        child_age,
        class_applied_for,
        source
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, parent_name, phone, email, message, source, created_at
    `;

    const params = [
      parent_name,
      phone,
      email,
      message,
      child_name,
      child_age,
      class_applied_for,
      source,
    ];

    const result = await query(insertSql, params);
    const saved = result.rows[0];

    // Send notifications (fire-and-forget, but log results)
    try {
      const notifyResults = await sendEnquiryNotifications(saved);
      if (!notifyResults.email.success || !notifyResults.telegram.success) {
        console.warn('[enquiry.routes] Some notifications failed:', {
          email: notifyResults.email.success ? 'OK' : notifyResults.email.error,
          telegram: notifyResults.telegram.success ? 'OK' : notifyResults.telegram.error
        });
      }
    } catch (notifyErr) {
      console.error('[enquiry.routes] Notification error:', notifyErr.message);
      console.error('[enquiry.routes] Notification stack:', notifyErr.stack);
    }

    return res.status(201).json(saved);
  } catch (err) {
    console.error('[enquiry.routes] Error saving enquiry:', err.message);
    return res.status(500).json({ error: 'Failed to save enquiry' });
  }
});

module.exports = router;
