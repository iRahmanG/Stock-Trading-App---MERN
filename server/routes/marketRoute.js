const express = require('express');
const router = express.Router();
const { getLiveStocks } = require('../controllers/marketController');

router.get('/', getLiveStocks);

module.exports = router;