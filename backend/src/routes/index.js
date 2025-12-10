// backend/src/routes/index.js
const express = require('express');
const healthRoutes = require('./health.routes');
const childrenRoutes = require('./children.routes');
const enquiryRoutes = require('./enquiry.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/children', childrenRoutes);
router.use('/enquiries', enquiryRoutes);

module.exports = router;
