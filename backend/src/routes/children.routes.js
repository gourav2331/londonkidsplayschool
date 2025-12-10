const express = require('express');
const router = express.Router();
const { getChildren } = require('../controllers/children.controller');

router.get('/', getChildren);

module.exports = router;
