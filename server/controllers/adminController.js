const User = require('../models/userModel');
const Order = require('../models/orderSchema'); 
const Stock = require('../models/stockSchema');

// @desc    Fetch all data for Admin Command Center
const getAdminDashboardData = async (req, res) => {
    try {
        const activeUsersCount = await User.countDocuments();
        const allUsers = await User.find({}).select('-password').sort({ createdAt: -1 });
        const allStocks = await Stock.find({});
        const globalLedger = await Order.find({}).sort({ createdAt: -1 }).limit(50);
        
        const systemLogs = [
            { id: 1, event: "Telemetry Sync", time: new Date(), status: "Success" },
            { id: 2, event: "Admin Login Detected", time: new Date(), status: "Success" }
        ];

        res.json({
            activeUsers: activeUsersCount,
            users: allUsers,
            stocks: allStocks,
            transactions: globalLedger,
            logs: systemLogs,
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

        // Apply updates if they are present in the request
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

module.exports = { getAdminDashboardData, updateUserByAdmin, updateStockByAdmin };