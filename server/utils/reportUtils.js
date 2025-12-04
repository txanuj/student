/**
 * Convert array of objects to CSV format
 */
const arrayToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';

    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            // Handle values with commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
        }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Format date for reports
 */
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Calculate monthly usage statistics
 */
const calculateMonthlyUsage = (items) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = items.map(item => {
        const monthlyUsage = item.usageHistory
            .filter(entry => {
                return entry.action === 'requested' && new Date(entry.date) >= thirtyDaysAgo;
            })
            .reduce((sum, entry) => sum + entry.quantity, 0);

        return {
            itemName: item.name,
            category: item.category,
            department: item.department,
            currentStock: item.quantity,
            monthlyUsage,
            stockStatus: item.stockStatus
        };
    });

    return stats;
};

/**
 * Calculate department distribution
 */
const calculateDepartmentDistribution = (items) => {
    const distribution = {};

    items.forEach(item => {
        if (!distribution[item.department]) {
            distribution[item.department] = {
                department: item.department,
                totalItems: 0,
                totalValue: 0,
                categories: new Set()
            };
        }

        distribution[item.department].totalItems += 1;
        distribution[item.department].totalValue += item.quantity;
        distribution[item.department].categories.add(item.category);
    });

    // Convert to array and format
    return Object.values(distribution).map(dept => ({
        department: dept.department,
        totalItems: dept.totalItems,
        totalValue: dept.totalValue,
        categories: dept.categories.size
    }));
};

/**
 * Calculate category analysis
 */
const calculateCategoryAnalysis = (items) => {
    const analysis = {};

    items.forEach(item => {
        if (!analysis[item.category]) {
            analysis[item.category] = {
                category: item.category,
                totalItems: 0,
                totalQuantity: 0,
                departments: new Set()
            };
        }

        analysis[item.category].totalItems += 1;
        analysis[item.category].totalQuantity += item.quantity;
        analysis[item.category].departments.add(item.department);
    });

    // Convert to array and format
    return Object.values(analysis).map(cat => ({
        category: cat.category,
        totalItems: cat.totalItems,
        totalQuantity: cat.totalQuantity,
        departments: cat.departments.size
    }));
};

module.exports = {
    arrayToCSV,
    formatDate,
    calculateMonthlyUsage,
    calculateDepartmentDistribution,
    calculateCategoryAnalysis
};
