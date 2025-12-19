const express = require('express');
const router = express.Router();
const { healthCheck, testNotifications } = require('../controllers/health.controller');

router.get('/', healthCheck);
router.post('/test-notifications', testNotifications);

module.exports = router;
