const express = require('express');
const router = express.Router();
// Destructure all required functions from the controller
const { 
    getAdminDashboardData, 
    updateUserByAdmin, 
    updateStockByAdmin,
    getUserAuditTrail,
    getFilteredTransactions,
    getSystemSettings,
    updateSystemSettings
} = require('../controllers/adminController'); 
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Unified route for all dashboard features
router.get('/telemetry', protect, isAdmin, getAdminDashboardData);

// Admin Action Routes
router.put('/user', protect, isAdmin, updateUserByAdmin);
router.put('/stock', protect, isAdmin, updateStockByAdmin);
// Register the new audit trail route
router.get('/audit/:userId', protect, isAdmin, getUserAuditTrail);
router.get('/ledger/filter', protect, isAdmin, getFilteredTransactions);

router.get('/settings', protect, isAdmin, getSystemSettings);
router.put('/settings', protect, isAdmin, updateSystemSettings);
module.exports = router;