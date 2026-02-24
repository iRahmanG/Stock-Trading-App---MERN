const express = require('express');
const router = express.Router();

const { getLiveStocks, getStockBySymbol } = require('../controllers/marketController');

router.get('/', getLiveStocks);
router.get('/:symbol', getStockBySymbol);

module.exports = router;