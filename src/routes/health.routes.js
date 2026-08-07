const express = require('express');
const router = express.Router();

const { getHealth } = require('../controller/healthController');

router.get('/', getHealth);

module.exports = router;
