const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    fee0_3: { type: Number, default: 100 },
    fee3_6: { type: Number, default: 200 },
    fee6_10: { type: Number, default: 300 },
    feeAbove10: { type: Number, default: 350 }
});

module.exports = mongoose.model('Setting', settingSchema);