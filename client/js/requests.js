let allRequests = [];
let filteredRequests = [];
let availableItems = [];

const loadRequests = async () => {
    try {
        const user = getUser();
        document.getElementById('userBadge').textContent = `${user.role} - ${user.department}`;

        const data = await apiRequest('/requests');
        allRequests = data.requests || [];
        filteredRequests = allRequests;

        // Load items for request form
        const itemsData = await apiRequest('/items');
        availableItems = itemsData.items || [];

        renderRequests();
    } catch (error) {
        console.error('Load requests error:', error);
    }
};

const renderRequests = () => {
    const tbody = document.getElementById('requestsTable');
    const user = getUser();

    if (filteredRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No requests found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredRequests.map(req => `
    <tr>
      <td><strong>${req.item?.name || 'N/A'}</strong></td>
      <td>${req.quantity}</td>
      <td>${req.requester?.email || 'N/A'}</td>
      <td>${req.department}</td>
      <td>
        <span class="badge badge-${getStatusBadgeClass(req.status)}">
          ${req.status}
        </span>
      </td>
      <td>${new Date(req.createdAt).toLocaleDateString()}</td>
      <td>
        ${user.role === 'Admin' && req.status === 'pending' ? `
          <button class="btn btn-sm btn-success" onclick="approveRequest('${req._id}')">Approve</button>
          <button class="btn btn-sm btn-danger" onclick="rejectRequest('${req._id}')">Reject</button>
        ` : req.status === 'pending' ? 'Pending' : req.approvalNotes || '-'}
      </td>
    </tr>
  `).join('');
};

const filterRequests = () => {
    const status = document.getElementById('statusFilter').value;

    filteredRequests = allRequests.filter(req => {
        return !status || req.status === status;
    });

    renderRequests();
};

const openRequestModal = () => {
    const select = document.getElementById('requestItem');
    select.innerHTML = '<option value="">Select an item</option>';

    availableItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item._id;
        option.textContent = `${item.name} (Available: ${item.quantity})`;
        select.appendChild(option);
    });

    document.getElementById('requestModal').classList.add('active');
};

const closeRequestModal = () => {
    document.getElementById('requestModal').classList.remove('active');
    document.getElementById('requestForm').reset();
};

const submitRequest = async (e) => {
    e.preventDefault();

    const requestData = {
        itemId: document.getElementById('requestItem').value,
        quantity: parseInt(document.getElementById('requestQuantity').value),
        reason: document.getElementById('requestReason').value
    };

    try {
        await apiRequest('/requests', {
            method: 'POST',
            body: JSON.stringify(requestData)
        });

        alert('Request submitted successfully');
        closeRequestModal();
        loadRequests();
    } catch (error) {
        alert('Failed to submit request: ' + error.message);
    }
};

const approveRequest = (id) => {
    document.getElementById('approvalRequestId').value = id;
    document.getElementById('approvalAction').value = 'approve';
    document.getElementById('approvalTitle').textContent = 'Approve Request';
    document.getElementById('approvalBtn').textContent = 'Approve';
    document.getElementById('approvalBtn').className = 'btn btn-success';
    document.getElementById('approvalModal').classList.add('active');
};

const rejectRequest = (id) => {
    document.getElementById('approvalRequestId').value = id;
    document.getElementById('approvalAction').value = 'reject';
    document.getElementById('approvalTitle').textContent = 'Reject Request';
    document.getElementById('approvalBtn').textContent = 'Reject';
    document.getElementById('approvalBtn').className = 'btn btn-danger';
    document.getElementById('approvalModal').classList.add('active');
};

const closeApprovalModal = () => {
    document.getElementById('approvalModal').classList.remove('active');
    document.getElementById('approvalForm').reset();
};

const processApproval = async (e) => {
    e.preventDefault();

    const requestId = document.getElementById('approvalRequestId').value;
    const action = document.getElementById('approvalAction').value;
    const notes = document.getElementById('approvalNotes').value;

    try {
        await apiRequest(`/requests/${requestId}/${action}`, {
            method: 'PUT',
            body: JSON.stringify({ notes })
        });

        alert(`Request ${action}d successfully`);
        closeApprovalModal();
        loadRequests();
    } catch (error) {
        alert(`Failed to ${action} request: ` + error.message);
    }
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'approved': return 'success';
        case 'rejected': return 'danger';
        default: return 'warning';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadRequests();

    document.getElementById('requestForm').addEventListener('submit', submitRequest);
    document.getElementById('approvalForm').addEventListener('submit', processApproval);
    document.getElementById('statusFilter').addEventListener('change', filterRequests);
});
