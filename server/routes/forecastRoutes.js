const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getForecasts, getAtRiskItems, getTopUsedItems } = require('../utils/forecastUtils');

// Get forecasts for all items
router.get('/', authenticate, async (req, res) => {
    try {
        const { department } = req.query;

        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        } else if (department) {
            filter.department = department;
        }

        const forecasts = await getForecasts(filter);

        res.json({
            success: true,
            count: forecasts.length,
            forecasts
        });
    } catch (error) {
        console.error('Forecast error:', error);
        res.status(500).json({ error: 'Failed to generate forecasts', details: error.message });
    }
});

// Get items at risk of stockout
router.get('/at-risk', authenticate, async (req, res) => {
    try {
        const { department } = req.query;

        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        } else if (department) {
            filter.department = department;
        }

        const atRiskItems = await getAtRiskItems(filter);

        res.json({
            success: true,
            count: atRiskItems.length,
            items: atRiskItems
        });
    } catch (error) {
        console.error('At-risk items error:', error);
        res.status(500).json({ error: 'Failed to fetch at-risk items', details: error.message });
    }
});

// Get top used items
router.get('/top-used', authenticate, async (req, res) => {
    try {
        const { department, limit } = req.query;

        let filter = {};

        // Staff can only see their department
        if (req.user.role === 'Staff') {
            filter.department = req.user.department;
        } else if (department) {
            filter.department = department;
        }

        const topItems = await getTopUsedItems(filter, parseInt(limit) || 10);

        res.json({
            success: true,
            count: topItems.length,
            items: topItems
        });
    } catch (error) {
        console.error('Top used items error:', error);
        res.status(500).json({ error: 'Failed to fetch top used items', details: error.message });
    }
});

module.exports = router;
