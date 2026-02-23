const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware'); // Import it here

router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

module.exports = router;