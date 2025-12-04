const Item = require('../models/Item');

/**
 * Calculate moving average for usage prediction
 */
const calculateMovingAverage = (usageHistory, days = 7) => {
    if (!usageHistory || usageHistory.length === 0) return 0;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentUsage = usageHistory.filter(entry =>
        entry.action === 'requested' && new Date(entry.date) >= cutoffDate
    );

    if (recentUsage.length === 0) return 0;

    const totalUsage = recentUsage.reduce((sum, entry) => sum + entry.quantity, 0);
    return totalUsage / days;
};

/**
 * Calculate depletion rate (days until stockout)
 */
const calculateDepletionRate = (currentStock, dailyUsage) => {
    if (dailyUsage <= 0) return Infinity;
    return Math.floor(currentStock / dailyUsage);
};

/**
 * Assess stock risk level
 */
const assessRiskLevel = (item, depletionDays) => {
    if (item.quantity <= 0) {
        return { level: 'critical', priority: 1, message: 'Out of stock' };
    }

    if (item.isCriticalStock()) {
        return { level: 'critical', priority: 1, message: 'Critical stock level' };
    }

    if (depletionDays <= 7) {
        return { level: 'critical', priority: 1, message: `Stock depletes in ${depletionDays} days` };
    }

    if (item.isLowStock() || depletionDays <= 14) {
        return { level: 'warning', priority: 2, message: `Low stock - ${depletionDays} days remaining` };
    }

    if (depletionDays <= 30) {
        return { level: 'caution', priority: 3, message: `Monitor stock - ${depletionDays} days remaining` };
    }

    return { level: 'safe', priority: 4, message: 'Stock levels healthy' };
};

/**
 * Analyze usage trends
 */
const analyzeTrend = (usageHistory) => {
    if (!usageHistory || usageHistory.length < 2) {
        return { trend: 'stable', change: 0 };
    }

    const requestHistory = usageHistory.filter(entry => entry.action === 'requested');

    if (requestHistory.length < 2) {
        return { trend: 'stable', change: 0 };
    }

    // Compare recent usage (last 7 days) vs previous period (8-14 days ago)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentUsage = requestHistory
        .filter(entry => new Date(entry.date) >= sevenDaysAgo)
        .reduce((sum, entry) => sum + entry.quantity, 0);

    const previousUsage = requestHistory
        .filter(entry => {
            const date = new Date(entry.date);
            return date >= fourteenDaysAgo && date < sevenDaysAgo;
        })
        .reduce((sum, entry) => sum + entry.quantity, 0);

    if (previousUsage === 0) {
        return { trend: 'stable', change: 0 };
    }

    const percentChange = ((recentUsage - previousUsage) / previousUsage) * 100;

    if (percentChange > 20) {
        return { trend: 'increasing', change: percentChange };
    } else if (percentChange < -20) {
        return { trend: 'decreasing', change: percentChange };
    }

    return { trend: 'stable', change: percentChange };
};

/**
 * Generate reorder recommendation
 */
const generateRecommendation = (item, dailyUsage, depletionDays, trend) => {
    const recommendations = [];

    // Calculate optimal reorder quantity
    const weeklyUsage = dailyUsage * 7;
    const monthlyUsage = dailyUsage * 30;

    let reorderQuantity = 0;

    if (trend.trend === 'increasing') {
        // Order more if usage is increasing
        reorderQuantity = Math.ceil(monthlyUsage * 1.5);
    } else if (trend.trend === 'decreasing') {
        // Order less if usage is decreasing
        reorderQuantity = Math.ceil(monthlyUsage * 0.75);
    } else {
        // Standard monthly supply
        reorderQuantity = Math.ceil(monthlyUsage);
    }

    // Ensure we reach at least max stock level
    const targetStock = Math.max(reorderQuantity, item.maxStockLevel);
    const neededQuantity = targetStock - item.quantity;

    if (neededQuantity > 0) {
        recommendations.push({
            action: 'reorder',
            quantity: neededQuantity,
            urgency: depletionDays <= 7 ? 'urgent' : depletionDays <= 14 ? 'high' : 'normal',
            reason: `Reorder ${neededQuantity} units to maintain ${targetStock} stock level`
        });
    }

    if (trend.trend === 'increasing') {
        recommendations.push({
            action: 'monitor',
            urgency: 'normal',
            reason: 'Usage trending upward - consider increasing max stock level'
        });
    }

    if (depletionDays <= 3) {
        recommendations.push({
            action: 'urgent_reorder',
            urgency: 'critical',
            reason: 'Critical: Stock will deplete within 3 days'
        });
    }

    return recommendations;
};

/**
 * Generate forecast for a single item
 */
const generateItemForecast = (item) => {
    const dailyUsage7Day = calculateMovingAverage(item.usageHistory, 7);
    const dailyUsage30Day = calculateMovingAverage(item.usageHistory, 30);
    const depletionDays = calculateDepletionRate(item.quantity, dailyUsage7Day);
    const risk = assessRiskLevel(item, depletionDays);
    const trend = analyzeTrend(item.usageHistory);
    const recommendations = generateRecommendation(item, dailyUsage7Day, depletionDays, trend);

    return {
        itemId: item._id,
        itemName: item.name,
        category: item.category,
        department: item.department,
        currentStock: item.quantity,
        minStockLevel: item.minStockLevel,
        maxStockLevel: item.maxStockLevel,
        prediction: {
            dailyUsage7Day: parseFloat(dailyUsage7Day.toFixed(2)),
            dailyUsage30Day: parseFloat(dailyUsage30Day.toFixed(2)),
            weeklyUsage: parseFloat((dailyUsage7Day * 7).toFixed(2)),
            monthlyUsage: parseFloat((dailyUsage30Day * 30).toFixed(2)),
            depletionDays: depletionDays === Infinity ? null : depletionDays,
            estimatedStockoutDate: depletionDays === Infinity ? null : new Date(Date.now() + depletionDays * 24 * 60 * 60 * 1000)
        },
        risk,
        trend,
        recommendations
    };
};

/**
 * Get forecasts for all items or filtered items
 */
const getForecasts = async (filter = {}) => {
    const items = await Item.find(filter);
    return items.map(item => generateItemForecast(item));
};

/**
 * Get items at risk of stockout
 */
const getAtRiskItems = async (filter = {}) => {
    const forecasts = await getForecasts(filter);
    return forecasts
        .filter(forecast => forecast.risk.priority <= 2)
        .sort((a, b) => a.risk.priority - b.risk.priority);
};

/**
 * Get top used items
 */
const getTopUsedItems = async (filter = {}, limit = 10) => {
    const forecasts = await getForecasts(filter);
    return forecasts
        .sort((a, b) => b.prediction.dailyUsage7Day - a.prediction.dailyUsage7Day)
        .slice(0, limit);
};

module.exports = {
    calculateMovingAverage,
    calculateDepletionRate,
    assessRiskLevel,
    analyzeTrend,
    generateRecommendation,
    generateItemForecast,
    getForecasts,
    getAtRiskItems,
    getTopUsedItems
};
