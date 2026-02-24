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
        const { user, symbol, name, price, count, totalPrice, stockType, orderType, orderStatus, stockExchange } = req.body;

        const trader = await User.findOne({ email: user });
        if (!trader) return res.status(404).json({ message: 'User not found' });

        // 1. Calculate the actual value in Rupees
        // If the exchange is NOT NSE, it's a USD stock (like AAPL/TSLA)
        const conversionRate = 90.0; 
        const valueInINR = (stockExchange === 'NSE' || stockExchange === 'BSE') 
            ? totalPrice 
            : totalPrice * conversionRate;

        // 2. Holding Check for Sell Orders
        if (orderType === 'sell') {
            const userOrders = await Order.find({ user, symbol });
            const currentHoldings = userOrders.reduce((acc, order) => {
                return order.orderType === 'buy' ? acc + order.count : acc - order.count;
            }, 0);

            if (currentHoldings < count) {
                return res.status(400).json({ 
                    message: `Insufficient holdings. You only own ${currentHoldings} shares of ${symbol}.` 
                });
            }
        }

        // 3. Balance Check for Buy Orders
        if (orderType === 'buy' && trader.balance < valueInINR) {
            return res.status(400).json({ message: 'Insufficient funds (Conversion included).' });
        }

        // 4. Update Balance in INR
        if (orderType === 'buy') {
            trader.balance -= valueInINR;
        } else if (orderType === 'sell') {
            trader.balance += valueInINR;
        }
        
        await trader.save();

        const order = await Order.create({
            user, symbol, name, price, count, totalPrice, stockType, orderType, orderStatus
        });

        res.status(201).json({ order, newBalance: trader.balance });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder };