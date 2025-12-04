const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get all items (with department filtering for staff)
router.get('/', authenticate, async (req, res) => {
    try {
        const { category, department, search } = req.query;

        // Build query
        let query = {};

        // Staff can only see their department's items
        if (req.user.role === 'Staff') {
            query.department = req.user.department;
        } else if (department) {
            // Admin can filter by department
            query.department = department;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const items = await Item.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: items.length,
            items
        });
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ error: 'Failed to fetch items', details: error.message });
    }
});

// Get single item
router.get('/:id', authenticate, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Check department access for staff
        if (req.user.role === 'Staff' && item.department !== req.user.department) {
            return res.status(403).json({ error: 'Access denied to this item' });
        }

        res.json({
            success: true,
            item
        });
    } catch (error) {
        console.error('Get item error:', error);
        res.status(500).json({ error: 'Failed to fetch item', details: error.message });
    }
});

// Create new item (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, category, quantity, minStockLevel, maxStockLevel, location, department, description } = req.body;

        // Validate required fields
        if (!name || !category || !location || !department) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const item = new Item({
            name,
            category,
            quantity: quantity || 0,
            minStockLevel: minStockLevel || 10,
            maxStockLevel: maxStockLevel || 100,
            location,
            department,
            description,
            usageHistory: [{
                date: new Date(),
                quantity: quantity || 0,
                action: 'added',
                notes: 'Initial stock'
            }]
        });

        await item.save();

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            item
        });
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ error: 'Failed to create item', details: error.message });
    }
});

// Update item (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, category, quantity, minStockLevel, maxStockLevel, location, department, description } = req.body;

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Track quantity changes
        if (quantity !== undefined && quantity !== item.quantity) {
            const difference = quantity - item.quantity;
            item.usageHistory.push({
                date: new Date(),
                quantity: Math.abs(difference),
                action: 'adjusted',
                notes: `Stock adjusted from ${item.quantity} to ${quantity}`
            });
        }

        // Update fields
        if (name) item.name = name;
        if (category) item.category = category;
        if (quantity !== undefined) item.quantity = quantity;
        if (minStockLevel !== undefined) item.minStockLevel = minStockLevel;
        if (maxStockLevel !== undefined) item.maxStockLevel = maxStockLevel;
        if (location) item.location = location;
        if (department) item.department = department;
        if (description !== undefined) item.description = description;

        await item.save();

        res.json({
            success: true,
            message: 'Item updated successfully',
            item
        });
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ error: 'Failed to update item', details: error.message });
    }
});

// Delete item (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await Item.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ error: 'Failed to delete item', details: error.message });
    }
});

// Get low stock items
router.get('/alerts/low-stock', authenticate, async (req, res) => {
    try {
        let query = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            query.department = req.user.department;
        }

        const items = await Item.find(query);
        const lowStockItems = items.filter(item => item.isLowStock());

        res.json({
            success: true,
            count: lowStockItems.length,
            items: lowStockItems
        });
    } catch (error) {
        console.error('Low stock error:', error);
        res.status(500).json({ error: 'Failed to fetch low stock items', details: error.message });
    }
});

module.exports = router;
