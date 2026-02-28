const Order = require('../models/orderSchema');
const User = require('../models/userModel');
const Settings = require('../models/settingsModel');
const Stock = require('../models/stockSchema'); // Added to check individual stock status

// @desc    Get all stock orders FOR THE LOGGED-IN USER ONLY
const getOrders = async (req, res) => {
    try {
        const userEmail = req.user ? req.user.email : req.query.user; 
        
        if (!userEmail) {
            return res.status(401).json({ message: "Not authorized to view these orders" });
        }

        const orders = await Order.find({ user: userEmail });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new stock order (Buy/Sell) with Admin Overrides
const addOrder = async (req, res) => {
    try {
        const { user, symbol, name, price, count, totalPrice, stockType, orderType, orderStatus, stockExchange } = req.body;

        // --- 1. ADMIN OVERRIDE: CHECK GLOBAL TRADING HALT ---
        const systemSettings = await Settings.findOne();
        if (systemSettings && systemSettings.tradingHalted) {
            return res.status(403).json({ 
                message: "Market operations are currently suspended by the administration." 
            });
        }

        // --- 2. ADMIN OVERRIDE: CHECK INDIVIDUAL STOCK HALT ---
        const targetedStock = await Stock.findOne({ symbol });
        if (targetedStock && targetedStock.status === 'Halted') {
            return res.status(403).json({ 
                message: `Trading for ${symbol} has been halted due to market volatility.` 
            });
        }

        // --- 3. ADMIN OVERRIDE: CHECK USER SUSPENSION (BAN) ---
        const trader = await User.findOne({ email: user });
        if (!trader) return res.status(404).json({ message: 'User not found' });
        
        if (trader.status === 'Suspended') {
            return res.status(403).json({ 
                message: "Your trading privileges have been revoked. Please contact support." 
            });
        }

        // --- 4. EXISTING SECURITY CHECK: BLOCK FRACTIONAL SHARES ---
        if (!Number.isInteger(Number(count)) || Number(count) <= 0) {
            return res.status(400).json({ 
                message: "Fractional trading is not supported. Please enter a whole number quantity." 
            });
        }

        // --- 5. CURRENCY CONVERSION (USD to INR) ---
        const conversionRate = 90.0; 
        const valueInINR = (stockExchange === 'NSE' || stockExchange === 'BSE') 
            ? totalPrice 
            : totalPrice * conversionRate;

        // --- 6. HOLDING CHECK FOR SELL ORDERS ---
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

        // --- 7. BALANCE CHECK FOR BUY ORDERS ---
        if (orderType === 'buy' && trader.balance < valueInINR) {
            return res.status(400).json({ message: 'Insufficient funds (Conversion included).' });
        }

        // --- 8. UPDATE BALANCE IN INR ---
        if (orderType === 'buy') {
            trader.balance -= valueInINR;
        } else if (orderType === 'sell') {
            trader.balance += valueInINR;
        }
        
        await trader.save();

        const order = await Order.create({
            user, symbol, name, price, 
            count: Math.floor(count), 
            totalPrice, stockType, orderType, orderStatus
        });

        res.status(201).json({ order, newBalance: trader.balance });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder };