const loadForecast = async () => {
    try {
        const user = getUser();
        document.getElementById('userBadge').textContent = `${user.role} - ${user.department}`;

        // Load at-risk items
        const atRiskData = await apiRequest('/forecast/at-risk');
        const atRiskItems = atRiskData.items || [];

        // Load top used items
        const topUsedData = await apiRequest('/forecast/top-used?limit=10');
        const topUsedItems = topUsedData.items || [];

        // Update stats
        const critical = atRiskItems.filter(item => item.risk.level === 'critical').length;
        document.getElementById('atRiskCount').textContent = atRiskItems.length;
        document.getElementById('criticalCount').textContent = critical;

        const avgUsage = topUsedItems.length > 0
            ? (topUsedItems.reduce((sum, item) => sum + item.prediction.dailyUsage7Day, 0) / topUsedItems.length).toFixed(1)
            : 0;
        document.getElementById('avgUsage').textContent = avgUsage;

        const reorderNeeded = atRiskItems.filter(item =>
            item.recommendations.some(rec => rec.action === 'reorder')
        ).length;
        document.getElementById('reorderCount').textContent = reorderNeeded;

        // Render tables
        renderAtRiskItems(atRiskItems);
        renderTopUsedItems(topUsedItems);
    } catch (error) {
        console.error('Load forecast error:', error);
    }
};

const renderAtRiskItems = (items) => {
    const tbody = document.getElementById('atRiskTable');

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No items at risk</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(item => {
        const reorderRec = item.recommendations.find(rec => rec.action === 'reorder');

        return `
      <tr>
        <td><strong>${item.itemName}</strong><br><small>${item.category}</small></td>
        <td>${item.currentStock}</td>
        <td>${item.prediction.dailyUsage7Day.toFixed(1)}</td>
        <td>${item.prediction.depletionDays !== null ? item.prediction.depletionDays + ' days' : 'N/A'}</td>
        <td>
          <span class="badge badge-${getRiskBadgeClass(item.risk.level)}">
            ${item.risk.level}
          </span>
        </td>
        <td>${reorderRec ? reorderRec.reason : item.risk.message}</td>
      </tr>
    `;
    }).join('');
};

const renderTopUsedItems = (items) => {
    const tbody = document.getElementById('topUsedTable');

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No usage data</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(item => `
    <tr>
      <td><strong>${item.itemName}</strong></td>
      <td>${item.category}</td>
      <td>${item.currentStock}</td>
      <td>${item.prediction.weeklyUsage.toFixed(1)}</td>
      <td>${item.prediction.monthlyUsage.toFixed(1)}</td>
      <td>
        <span class="badge badge-${getTrendBadgeClass(item.trend.trend)}">
          ${item.trend.trend} ${item.trend.change !== 0 ? `(${item.trend.change > 0 ? '+' : ''}${item.trend.change.toFixed(0)}%)` : ''}
        </span>
      </td>
    </tr>
  `).join('');
};

const getRiskBadgeClass = (level) => {
    switch (level) {
        case 'critical': return 'danger';
        case 'warning': return 'warning';
        case 'caution': return 'info';
        default: return 'success';
    }
};

const getTrendBadgeClass = (trend) => {
    switch (trend) {
        case 'increasing': return 'warning';
        case 'decreasing': return 'info';
        default: return 'success';
    }
};

document.addEventListener('DOMContentLoaded', loadForecast);
