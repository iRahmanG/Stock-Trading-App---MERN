const User = require('../models/userModel');
const Order = require('../models/orderSchema');
const Stock = require('../models/stockSchema');

const getAdminDashboardData = async (req, res) => {
    try {
        const activeUsersCount = await User.countDocuments();
        const allUsers = await User.find({}).select('-password').sort({ createdAt: -1 });
        const allStocks = await Stock.find({});
        const globalLedger = await Order.find({}).sort({ createdAt: -1 }).limit(50);
        
        // Mocking Logs and Settings for this implementation
        const systemLogs = [
            { id: 1, event: "Server Restart", time: new Date(), status: "Success" },
            { id: 2, event: "DB Backup", time: new Date(Date.now() - 3600000), status: "Success" }
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

module.exports = { getAdminDashboardData };