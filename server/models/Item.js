const mongoose = require('mongoose');

const usageHistorySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        enum: ['added', 'removed', 'adjusted', 'requested'],
        required: true
    },
    notes: String
}, { _id: false });

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    minStockLevel: {
        type: Number,
        default: 10,
        min: 0
    },
    maxStockLevel: {
        type: Number,
        default: 100,
        min: 0
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    department: {
        type: String,
        enum: ['Lab', 'Library', 'Sports', 'Hostel', 'Admin'],
        required: [true, 'Department is required']
    },
    usageHistory: [usageHistorySchema],
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Method to update stock
itemSchema.methods.updateStock = function (quantity, action, notes = '') {
    this.quantity += quantity;
    this.usageHistory.push({
        date: new Date(),
        quantity: Math.abs(quantity),
        action,
        notes
    });
    return this.save();
};

// Method to check if stock is low
itemSchema.methods.isLowStock = function () {
    return this.quantity <= this.minStockLevel;
};

// Method to check if stock is critical
itemSchema.methods.isCriticalStock = function () {
    return this.quantity <= (this.minStockLevel * 0.5);
};

// Virtual for stock status
itemSchema.virtual('stockStatus').get(function () {
    if (this.isCriticalStock()) return 'critical';
    if (this.isLowStock()) return 'low';
    if (this.quantity >= this.maxStockLevel) return 'overstocked';
    return 'normal';
});

// Ensure virtuals are included in JSON
itemSchema.set('toJSON', { virtuals: true });
itemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Item', itemSchema);
