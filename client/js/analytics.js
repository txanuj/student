let departmentChart = null;
let categoryChart = null;

const loadAnalytics = async () => {
    try {
        const user = getUser();
        document.getElementById('userBadge').textContent = `${user.role} - ${user.department}`;

        // Load all data
        await Promise.all([
            loadDepartmentChart(),
            loadCategoryChart(),
            loadMonthlyUsage()
        ]);
    } catch (error) {
        console.error('Load analytics error:', error);
    }
};

const loadDepartmentChart = async () => {
    try {
        const data = await apiRequest('/reports/department-distribution');
        const distribution = data.data || [];

        const ctx = document.getElementById('departmentChart').getContext('2d');
        if (departmentChart) departmentChart.destroy();

        departmentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: distribution.map(d => d.department),
                datasets: [{
                    label: 'Total Items',
                    data: distribution.map(d => d.totalItems),
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#cbd5e1'
                        }
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
        console.error('Department chart error:', error);
    }
};

const loadCategoryChart = async () => {
    try {
        const data = await apiRequest('/reports/category-analysis');
        const analysis = data.data || [];

        const ctx = document.getElementById('categoryChart').getContext('2d');
        if (categoryChart) categoryChart.destroy();

        categoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: analysis.map(c => c.category),
                datasets: [{
                    data: analysis.map(c => c.totalQuantity),
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgba(99, 102, 241, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
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
    } catch (error) {
        console.error('Category chart error:', error);
    }
};

const loadMonthlyUsage = async () => {
    try {
        const data = await apiRequest('/reports/monthly-usage');
        const usage = data.data || [];

        const tbody = document.getElementById('monthlyUsageTable');

        if (usage.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No usage data</td></tr>';
            return;
        }

        tbody.innerHTML = usage.map(item => `
      <tr>
        <td><strong>${item.itemName}</strong></td>
        <td>${item.category}</td>
        <td>${item.department}</td>
        <td>${item.currentStock}</td>
        <td>${item.monthlyUsage}</td>
        <td>
          <span class="badge badge-${getStockBadgeClass(item.stockStatus)}">
            ${item.stockStatus}
          </span>
        </td>
      </tr>
    `).join('');
    } catch (error) {
        console.error('Monthly usage error:', error);
    }
};

const exportItems = async () => {
    try {
        const token = getToken();
        window.open(`/api/reports/export/items-csv?token=${token}`, '_blank');
    } catch (error) {
        alert('Export failed: ' + error.message);
    }
};

const exportRequests = async () => {
    try {
        const token = getToken();
        window.open(`/api/reports/export/requests-csv?token=${token}`, '_blank');
    } catch (error) {
        alert('Export failed: ' + error.message);
    }
};

const getStockBadgeClass = (status) => {
    switch (status) {
        case 'critical': return 'danger';
        case 'low': return 'warning';
        case 'overstocked': return 'info';
        default: return 'success';
    }
};

document.addEventListener('DOMContentLoaded', loadAnalytics);
