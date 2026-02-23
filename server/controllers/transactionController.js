const Transaction = require('../models/transactionModel');

// @desc    Get transactions (optionally filtered by user)
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        const { user } = req.query; 
        const transactions = await Transaction.find(user ? { user } : {});
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new transaction (Deposit/Withdraw)
// @route   POST /api/transactions
const addTransaction = async (req, res) => {
    try {
        const { user, type, paymentMode, amount, time } = req.body;
        const transaction = await Transaction.create({
            user, type, paymentMode, amount, time
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTransactions, addTransaction };