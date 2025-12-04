const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'Item is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Requester is required']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    department: {
        type: String,
        enum: ['Lab', 'Library', 'Sports', 'Hostel', 'Admin'],
        required: [true, 'Department is required']
    },
    reason: {
        type: String,
        trim: true
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: {
        type: Date
    },
    approvalNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
requestSchema.index({ status: 1, department: 1 });
requestSchema.index({ requester: 1 });

// Method to approve request
requestSchema.methods.approve = async function (approverId, notes = '') {
    this.status = 'approved';
    this.approver = approverId;
    this.approvalDate = new Date();
    this.approvalNotes = notes;
    return this.save();
};

// Method to reject request
requestSchema.methods.reject = async function (approverId, notes = '') {
    this.status = 'rejected';
    this.approver = approverId;
    this.approvalDate = new Date();
    this.approvalNotes = notes;
    return this.save();
};

module.exports = mongoose.model('Request', requestSchema);
