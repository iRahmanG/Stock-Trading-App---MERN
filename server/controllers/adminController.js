const User = require('../models/userModel');
const Order = require('../models/orderSchema'); 
const Stock = require('../models/stockSchema');
const Settings = require('../models/settingsModel');
// @desc    Get users with search functionality
const getAdminDashboardData = async (req, res) => {
    try {
        const { search } = req.query;
        let userQuery = {};

        if (search) {
            userQuery = {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const activeUsersCount = await User.countDocuments();
        const allUsers = await User.find(userQuery).select('-password').sort({ createdAt: -1 });
        const allStocks = await Stock.find({});
        const globalLedger = await Order.find({}).sort({ createdAt: -1 }).limit(50);
        
        res.json({
            activeUsers: activeUsersCount,
            users: allUsers,
            stocks: allStocks,
            transactions: globalLedger,
            serverStatus: "Operational",
            latency: "24ms"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to load admin telemetry." });
    }
};

// @desc    Update user status, balance, or role
const updateUserByAdmin = async (req, res) => {
    try {
        const { userId, balance, isAdmin, status } = req.body;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });

        if (balance !== undefined) user.balance = balance;
        if (isAdmin !== undefined) user.isAdmin = isAdmin;
        if (status !== undefined) user.status = status;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Stock Status (Halt/Resume Only)
const updateStockByAdmin = async (req, res) => {
    try {
        const { symbol, status } = req.body;
        const stock = await Stock.findOne({ symbol });
        if (stock) {
            stock.status = status || stock.status; 
            await stock.save();
            res.json({ message: `Trading for ${symbol} set to ${stock.status}` });
        } else {
            res.status(404).json({ message: "Stock not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch audit trail for a specific user
const getUserAuditTrail = async (req, res) => {
    try {
        const { userId } = req.params;
        const userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(userOrders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user audit trail." });
    }
};

// @desc    Fetch transactions filtered by user
const getFilteredTransactions = async (req, res) => {
    try {
        const { username } = req.query;
        let query = {};

        if (username) {
            query = { user: { $regex: username, $options: 'i' } };
        }

        const transactions = await Order.find(query).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Failed to filter ledger: " + error.message });
    }
};
// @desc    Get system settings
const getSystemSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({}); // Create default if none exist
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching settings" });
    }
};

// @desc    Update system settings
const updateSystemSettings = async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Failed to update system toggles" });
    }
};

module.exports = { 
    getAdminDashboardData, 
    updateUserByAdmin, 
    updateStockByAdmin, 
    getUserAuditTrail,
    getFilteredTransactions,
    getSystemSettings, 
    updateSystemSettings
};