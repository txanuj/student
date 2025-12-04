// Dashboard functionality
let stockChart = null;
let requestChart = null;

// Load dashboard data
const loadDashboard = async () => {
    try {
        const user = getUser();

        // Update user badge
        document.getElementById('userBadge').textContent = `${user.role} - ${user.department}`;

        // Load stats
        await loadStats();

        // Load recent items
        await loadRecentItems();

        // Load recent requests
        await loadRecentRequests();

        // Load charts
        await loadCharts();
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
};

// Load statistics
const loadStats = async () => {
    try {
        // Get items
        const itemsData = await apiRequest('/items');
        const items = itemsData.items || [];

        // Get requests
        const requestsData = await apiRequest('/requests');
        const requests = requestsData.requests || [];

        // Get at-risk items
        const atRiskData = await apiRequest('/forecast/at-risk');
        const atRiskItems = atRiskData.items || [];

        // Update stats
        document.getElementById('totalItems').textContent = items.length;

        const lowStock = items.filter(item => item.stockStatus === 'low' || item.stockStatus === 'critical').length;
        document.getElementById('lowStockItems').textContent = lowStock;

        const pending = requests.filter(req => req.status === 'pending').length;
        document.getElementById('pendingRequests').textContent = pending;

        document.getElementById('atRiskItems').textContent = atRiskItems.length;
    } catch (error) {
        console.error('Stats load error:', error);
    }
};

// Load recent items
const loadRecentItems = async () => {
    try {
        const data = await apiRequest('/items');
        const items = data.items || [];

        const tbody = document.getElementById('recentItemsTable');

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No items found</td></tr>';
            return;
        }

        tbody.innerHTML = items.slice(0, 5).map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>
          <span class="badge badge-${getStockBadgeClass(item.stockStatus)}">
            ${item.stockStatus}
          </span>
        </td>
      </tr>
    `).join('');
    } catch (error) {
        console.error('Recent items load error:', error);
    }
};

// Load recent requests
const loadRecentRequests = async () => {
    try {
        const data = await apiRequest('/requests');
        const requests = data.requests || [];

        const tbody = document.getElementById('recentRequestsTable');

        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No requests found</td></tr>';
            return;
        }

        tbody.innerHTML = requests.slice(0, 5).map(req => `
      <tr>
        <td>${req.item?.name || 'N/A'}</td>
        <td>${req.quantity}</td>
        <td>
          <span class="badge badge-${getStatusBadgeClass(req.status)}">
            ${req.status}
          </span>
        </td>
        <td>${new Date(req.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');
    } catch (error) {
        console.error('Recent requests load error:', error);
    }
};

// Load charts
const loadCharts = async () => {
    try {
        const itemsData = await apiRequest('/items');
        const items = itemsData.items || [];

        const requestsData = await apiRequest('/requests');
        const requests = requestsData.requests || [];

        // Stock distribution chart
        const stockCounts = {
            normal: items.filter(i => i.stockStatus === 'normal').length,
            low: items.filter(i => i.stockStatus === 'low').length,
            critical: items.filter(i => i.stockStatus === 'critical').length,
            overstocked: items.filter(i => i.stockStatus === 'overstocked').length
        };

        const stockCtx = document.getElementById('stockChart').getContext('2d');
        if (stockChart) stockChart.destroy();

        stockChart = new Chart(stockCtx, {
            type: 'doughnut',
            data: {
                labels: ['Normal', 'Low', 'Critical', 'Overstocked'],
                datasets: [{
                    data: [stockCounts.normal, stockCounts.low, stockCounts.critical, stockCounts.overstocked],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(59, 130, 246, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cbd5e1',
                            padding: 15
                        }
                    }
                }
            }
        });

        // Request status chart
        const requestCounts = {
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length
        };

        const requestCtx = document.getElementById('requestChart').getContext('2d');
        if (requestChart) requestChart.destroy();

        requestChart = new Chart(requestCtx, {
            type: 'bar',
            data: {
                labels: ['Pending', 'Approved', 'Rejected'],
                datasets: [{
                    label: 'Requests',
                    data: [requestCounts.pending, requestCounts.approved, requestCounts.rejected],
                    backgroundColor: [
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Charts load error:', error);
    }
};

// Helper functions
const getStockBadgeClass = (status) => {
    switch (status) {
        case 'critical': return 'danger';
        case 'low': return 'warning';
        case 'overstocked': return 'info';
        default: return 'success';
    }
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'approved': return 'success';
        case 'rejected': return 'danger';
        default: return 'warning';
    }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', loadDashboard);
