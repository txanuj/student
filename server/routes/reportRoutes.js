const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Request = require('../models/Request');
const { authenticate } = require('../middleware/auth');
const {
    arrayToCSV,
    calculateMonthlyUsage,
    calculateDepartmentDistribution,
    calculateCategoryAnalysis
} = require('../utils/reportUtils');

// Get monthly usage report
router.get('/monthly-usage', authenticate, async (req, res) => {
    try {
        const { department } = req.query;

        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        } else if (department) {
            filter.department = department;
        }

        const items = await Item.find(filter);
        const monthlyUsage = calculateMonthlyUsage(items);

        res.json({
            success: true,
            count: monthlyUsage.length,
            data: monthlyUsage
        });
    } catch (error) {
        console.error('Monthly usage error:', error);
        res.status(500).json({ error: 'Failed to generate monthly usage report', details: error.message });
    }
});

// Get department distribution
router.get('/department-distribution', authenticate, async (req, res) => {
    try {
        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        }

        const items = await Item.find(filter);
        const distribution = calculateDepartmentDistribution(items);

        res.json({
            success: true,
            count: distribution.length,
            data: distribution
        });
    } catch (error) {
        console.error('Department distribution error:', error);
        res.status(500).json({ error: 'Failed to generate department distribution', details: error.message });
    }
});

// Get category analysis
router.get('/category-analysis', authenticate, async (req, res) => {
    try {
        const { department } = req.query;

        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        } else if (department) {
            filter.department = department;
        }

        const items = await Item.find(filter);
        const analysis = calculateCategoryAnalysis(items);

        res.json({
            success: true,
            count: analysis.length,
            data: analysis
        });
    } catch (error) {
        console.error('Category analysis error:', error);
        res.status(500).json({ error: 'Failed to generate category analysis', details: error.message });
    }
});

// Export items to CSV
router.get('/export/items-csv', authenticate, async (req, res) => {
    try {
        const { department } = req.query;

        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        } else if (department) {
            filter.department = department;
        }

        const items = await Item.find(filter);

        const csvData = items.map(item => ({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            minStockLevel: item.minStockLevel,
            maxStockLevel: item.maxStockLevel,
            location: item.location,
            department: item.department,
            stockStatus: item.stockStatus,
            createdAt: new Date(item.createdAt).toLocaleDateString()
        }));

        const headers = ['name', 'category', 'quantity', 'minStockLevel', 'maxStockLevel', 'location', 'department', 'stockStatus', 'createdAt'];
        const csv = arrayToCSV(csvData, headers);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=items-export.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export items error:', error);
        res.status(500).json({ error: 'Failed to export items', details: error.message });
    }
});

// Export requests to CSV
router.get('/export/requests-csv', authenticate, async (req, res) => {
    try {
        const { department } = req.query;

        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        } else if (department) {
            filter.department = department;
        }

        const requests = await Request.find(filter)
            .populate('item', 'name category')
            .populate('requester', 'email')
            .populate('approver', 'email');

        const csvData = requests.map(request => ({
            itemName: request.item?.name || 'N/A',
            category: request.item?.category || 'N/A',
            quantity: request.quantity,
            requester: request.requester?.email || 'N/A',
            department: request.department,
            status: request.status,
            reason: request.reason || '',
            approver: request.approver?.email || 'N/A',
            approvalNotes: request.approvalNotes || '',
            createdAt: new Date(request.createdAt).toLocaleDateString(),
            approvalDate: request.approvalDate ? new Date(request.approvalDate).toLocaleDateString() : 'N/A'
        }));

        const headers = ['itemName', 'category', 'quantity', 'requester', 'department', 'status', 'reason', 'approver', 'approvalNotes', 'createdAt', 'approvalDate'];
        const csv = arrayToCSV(csvData, headers);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=requests-export.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export requests error:', error);
        res.status(500).json({ error: 'Failed to export requests', details: error.message });
    }
});

module.exports = router;
