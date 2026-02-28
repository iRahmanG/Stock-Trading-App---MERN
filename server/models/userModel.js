const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Active', 'Suspended'],
        default: 'Active'
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);