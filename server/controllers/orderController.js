const Order = require('../models/orderSchema');
const User = require('../models/userModel');

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

        const trader = await User.findOne({ email: user });

        if (!trader) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Check for sufficient funds!
        if (orderType === 'buy' && trader.balance < totalPrice) {
            return res.status(400).json({ message: 'Insufficient funds for this trade.' });
        }

        // 3. Do the math: Subtract for Buy, Add for Sell
        if (orderType === 'buy') {
            trader.balance -= totalPrice;
        } else if (orderType === 'sell') {
            trader.balance += totalPrice;
        }
        
        // Save the new balance to the database
        await trader.save();

        // 4. Create the actual Order record
        const order = await Order.create({
            user, symbol, name, price, count, totalPrice, stockType, orderType, orderStatus
        });

        // 5. Send back the order AND the new balance to the frontend!
        res.status(201).json({ order, newBalance: trader.balance });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder };