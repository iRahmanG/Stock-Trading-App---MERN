const Order = require('../models/orderSchema');

// @desc    Get all stock orders (optionally filtered by user)
// @route   GET /api/orders
const getOrders = async (req, res) => {
    try {
        const { user } = req.query;
        const orders = await Order.find(user ? { user } : {});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new stock order (Buy/Sell)
// @route   POST /api/orders
const addOrder = async (req, res) => {
    try {
        const { user, symbol, name, price, count, totalPrice, stockType, orderType, orderStatus } = req.body;
        const order = await Order.create({
            user, symbol, name, price, count, totalPrice, stockType, orderType, orderStatus
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder };