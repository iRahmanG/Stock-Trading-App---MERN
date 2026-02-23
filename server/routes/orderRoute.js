const express = require('express');
const router = express.Router();
const { getOrders, addOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware'); // Import it here

router.route('/')
    .get(protect, getOrders)
    .post(protect, addOrder);

module.exports = router;