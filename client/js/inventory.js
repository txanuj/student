let allItems = [];
let filteredItems = [];

// Load inventory
const loadInventory = async () => {
    try {
        const user = getUser();
        document.getElementById('userBadge').textContent = `${user.role} - ${user.department}`;

        // Show add button for admin
        if (user.role === 'Admin') {
            document.getElementById('addItemBtn').style.display = 'block';
        }

        const data = await apiRequest('/items');
        allItems = data.items || [];
        filteredItems = allItems;

        // Populate category filter
        const categories = [...new Set(allItems.map(item => item.category))];
        const categoryFilter = document.getElementById('categoryFilter');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });

        renderItems();
    } catch (error) {
        console.error('Load inventory error:', error);
    }
};

// Render items
const renderItems = () => {
    const tbody = document.getElementById('itemsTable');
    const user = getUser();

    if (filteredItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No items found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredItems.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td>${item.department}</td>
      <td>${item.quantity}</td>
      <td>${item.location}</td>
      <td>
        <span class="badge badge-${getStockBadgeClass(item.stockStatus)}">
          ${item.stockStatus}
        </span>
      </td>
      <td>
        ${user.role === 'Admin' ? `
          <button class="btn btn-sm btn-secondary" onclick="editItem('${item._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteItem('${item._id}', '${item.name}')">Delete</button>
        ` : '-'}
      </td>
    </tr>
  `).join('');
};

// Filter items
const filterItems = () => {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;

    filteredItems = allItems.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search);
        const matchCategory = !category || item.category === category;
        const matchStatus = !status || item.stockStatus === status;

        return matchSearch && matchCategory && matchStatus;
    });

    renderItems();
};

// Open modal
const openModal = (title = 'Add Item') => {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('itemModal').classList.add('active');
};

// Close modal
const closeModal = () => {
    document.getElementById('itemModal').classList.remove('active');
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
};

// Edit item
const editItem = async (id) => {
    const item = allItems.find(i => i._id === id);
    if (!item) return;

    document.getElementById('itemId').value = item._id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemDepartment').value = item.department;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemLocation').value = item.location;
    document.getElementById('itemMinStock').value = item.minStockLevel;
    document.getElementById('itemMaxStock').value = item.maxStockLevel;
    document.getElementById('itemDescription').value = item.description || '';

    openModal('Edit Item');
};

// Delete item
const deleteItem = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
        await apiRequest(`/items/${id}`, { method: 'DELETE' });
        alert('Item deleted successfully');
        loadInventory();
    } catch (error) {
        alert('Failed to delete item: ' + error.message);
    }
};

// Save item
const saveItem = async (e) => {
    e.preventDefault();

    const itemId = document.getElementById('itemId').value;
    const itemData = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        department: document.getElementById('itemDepartment').value,
        quantity: parseInt(document.getElementById('itemQuantity').value),
        location: document.getElementById('itemLocation').value,
        minStockLevel: parseInt(document.getElementById('itemMinStock').value),
        maxStockLevel: parseInt(document.getElementById('itemMaxStock').value),
        description: document.getElementById('itemDescription').value
    };

    try {
        if (itemId) {
            await apiRequest(`/items/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify(itemData)
            });
            alert('Item updated successfully');
        } else {
            await apiRequest('/items', {
                method: 'POST',
                body: JSON.stringify(itemData)
            });
            alert('Item created successfully');
        }

        closeModal();
        loadInventory();
    } catch (error) {
        alert('Failed to save item: ' + error.message);
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();

    document.getElementById('addItemBtn').addEventListener('click', () => openModal());
    document.getElementById('itemForm').addEventListener('submit', saveItem);
    document.getElementById('searchInput').addEventListener('input', filterItems);
    document.getElementById('categoryFilter').addEventListener('change', filterItems);
    document.getElementById('statusFilter').addEventListener('change', filterItems);
});
