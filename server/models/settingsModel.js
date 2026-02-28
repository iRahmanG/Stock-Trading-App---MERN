const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    maintenanceMode: { type: Boolean, default: false },
    tradingHalted: { type: Boolean, default: false },
    globalMaxTradeLimit: { type: Number, default: 100000 },
    apiKeys: {
        polygon: { type: String, default: "" },
        alphaVantage: { type: String, default: "" }
    },
    updatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);