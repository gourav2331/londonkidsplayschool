// backend/src/controllers/enquiry.controller.js
const { query } = require('../helpers/db.helper');
const { sendEnquiryNotifications } = require('../services/notification.service');

async function createEnquiry(req, res) {
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
    const sql = `
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

    const result = await query(sql, params);
    const saved = result.rows[0];

    try {
      await sendEnquiryNotifications(saved);
    } catch (notifyErr) {
      console.warn('[enquiry.controller] Notification error:', notifyErr.message);
    }

    return res.status(201).json(saved);
  } catch (err) {
    console.error('[enquiry.controller] Error creating enquiry:', err.message);
    return res.status(500).json({ error: 'Failed to create enquiry' });
  }
}

module.exports = {
  createEnquiry,
};
