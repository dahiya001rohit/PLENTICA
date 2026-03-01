const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: String,
    percent: Number,
    color: String,
});

const profitSchema = new mongoose.Schema({
    name: String,
    amount: String,
    percent: Number,
    color: String,
});

const fieldSchema = new mongoose.Schema({
    name: String,
    bgColor: String,
    borderColor: String,
});

const farmPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    landSize: {
        type: Number,
        required: true,
    },
    stats: {
        totalYield: String,
        waterUsage: String,
        profitMargin: String,
        sustainability: String,
    },
    crops: [cropSchema],
    profits: [profitSchema],
    plantingGrid: [[Number]],
    fields: [fieldSchema],
    insights: {
        type: mongoose.Schema.Types.Mixed,
    },
    irrigation: {
        type: mongoose.Schema.Types.Mixed,
    },
    rawPlan: {
        type: mongoose.Schema.Types.Mixed,
    },
}, { timestamps: true });

module.exports = mongoose.model('FarmPlan', farmPlanSchema);
