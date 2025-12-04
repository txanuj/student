const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Item = require('../models/Item');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get all requests (filtered by role and department)
router.get('/', authenticate, async (req, res) => {
    try {
        const { status, department } = req.query;

        let query = {};

        // Staff can only see their department's requests
        if (req.user.role === 'Staff') {
            query.department = req.user.department;
        } else if (department) {
            // Admin can filter by department
            query.department = department;
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        const requests = await Request.find(query)
            .populate('item', 'name category')
            .populate('requester', 'email department')
            .populate('approver', 'email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
    }
});

// Get single request
router.get('/:id', authenticate, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('item')
            .populate('requester', 'email department')
            .populate('approver', 'email');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check department access for staff
        if (req.user.role === 'Staff' && request.department !== req.user.department) {
            return res.status(403).json({ error: 'Access denied to this request' });
        }

        res.json({
            success: true,
            request
        });
    } catch (error) {
        console.error('Get request error:', error);
        res.status(500).json({ error: 'Failed to fetch request', details: error.message });
    }
});

// Create new request
router.post('/', authenticate, async (req, res) => {
    try {
        const { itemId, quantity, reason } = req.body;

        // Validate input
        if (!itemId || !quantity) {
            return res.status(400).json({ error: 'Please provide item and quantity' });
        }

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Staff can only request from their department
        if (req.user.role === 'Staff' && item.department !== req.user.department) {
            return res.status(403).json({ error: 'Cannot request items from other departments' });
        }

        // Create request
        const request = new Request({
            item: itemId,
            quantity,
            requester: req.user._id,
            department: item.department,
            reason
        });

        await request.save();

        // Populate for response
        await request.populate('item', 'name category');
        await request.populate('requester', 'email department');

        res.status(201).json({
            success: true,
            message: 'Request created successfully',
            request
        });
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ error: 'Failed to create request', details: error.message });
    }
});

// Approve request (admin only)
router.put('/:id/approve', authenticate, requireAdmin, async (req, res) => {
    try {
        const { notes } = req.body;

        const request = await Request.findById(req.params.id).populate('item');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request has already been processed' });
        }

        // Check if item has enough stock
        if (request.item.quantity < request.quantity) {
            return res.status(400).json({
                error: 'Insufficient stock',
                available: request.item.quantity,
                requested: request.quantity
            });
        }

        // Approve request
        await request.approve(req.user._id, notes);

        // Update item stock
        await request.item.updateStock(
            -request.quantity,
            'requested',
            `Approved request #${request._id}`
        );

        // Populate for response
        await request.populate('requester', 'email department');
        await request.populate('approver', 'email');

        res.json({
            success: true,
            message: 'Request approved successfully',
            request
        });
    } catch (error) {
        console.error('Approve request error:', error);
        res.status(500).json({ error: 'Failed to approve request', details: error.message });
    }
});

// Reject request (admin only)
router.put('/:id/reject', authenticate, requireAdmin, async (req, res) => {
    try {
        const { notes } = req.body;

        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request has already been processed' });
        }

        // Reject request
        await request.reject(req.user._id, notes);

        // Populate for response
        await request.populate('item', 'name category');
        await request.populate('requester', 'email department');
        await request.populate('approver', 'email');

        res.json({
            success: true,
            message: 'Request rejected successfully',
            request
        });
    } catch (error) {
        console.error('Reject request error:', error);
        res.status(500).json({ error: 'Failed to reject request', details: error.message });
    }
});

// Delete request (requester or admin only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Only requester or admin can delete
        if (req.user.role !== 'Admin' && request.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Can only delete pending requests
        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Cannot delete processed requests' });
        }

        await Request.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        console.error('Delete request error:', error);
        res.status(500).json({ error: 'Failed to delete request', details: error.message });
    }
});

module.exports = router;
