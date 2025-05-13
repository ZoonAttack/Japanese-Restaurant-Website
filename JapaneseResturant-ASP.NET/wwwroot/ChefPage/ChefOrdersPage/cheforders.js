
async function regenerateToken() {
    var refreshToken = sessionStorage.getItem("refreshToken");
    console.log(refreshToken);
    if (!refreshToken) {
        alert("You need to login again!")
        return;
    }
    const response = await fetch("/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
        // If the response is successful, get the new tokens
        const responseBody = await response.json();
        const newAccessToken = responseBody.accessToken;
        const newRefreshToken = responseBody.refreshToken;

        // Store the new tokens in sessionStorage
        sessionStorage.setItem('accessToken', newAccessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);

        console.log("New access token and refresh token stored.");
    } else {
        // Handle the error (e.g., refresh token is invalid or expired)
        alert("Unable to refresh tokens. Please log in again.");
    }
}
async function authFetch(input, init = {}) {
    let token = sessionStorage.getItem('accessToken');
    console.log(token);
    init.headers = {
        ...(init.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    let response = await fetch(input, init);
    if (response.status !== 401) return response;

    // Attempt token refresh once
    await regenerateToken();
    token = sessionStorage.getItem('accessToken');
    init.headers['Authorization'] = `Bearer ${token}`;

    response = await fetch(input, init);
    if (response.status === 401) {
        // Refresh failed → force logout
        sessionStorage.clear();
        window.location.replace("/SignIn/signin.html");
    }
    return response;
}

    // Sample orders data
const orders = [
];
async function init() {
    getOrders();
    renderOrders();
    setupEventListeners();
}
// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function getOrders() {
    const response = await authFetch('getordersdata', {

        method: 'GET',
        header: {
            "Content-Type": "application/json"
        }
    })
    if (response.ok) {

        ordersList = await response.json();
        renderOrders();
    }
    else {
        showNotification('something went wrong', response.text());

    }
}

function renderOrders(filter = 'all') {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    ordersList.innerHTML = '';
    
    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status === filter);
    
    filteredOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-card';
        
        // Calculate total
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Format time
        const orderTime = new Date(order.time);
        const timeString = orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Status class
        const statusClass = `status-${order.status}`;
        const statusText = {
            pending: "Pending Confirmation",
            preparing: "Preparing",
            ready: "Ready for Pickup",
            completed: "Completed"
        }[order.status];
        
        orderElement.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-time">${timeString}</span>
                </div>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            
            <div class="order-customer">
                <strong>Customer:</strong> ${order.customer}
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>EGP ${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            
            ${order.notes ? `
            <div class="order-notes">
                <strong>Notes:</strong> ${order.notes}
            </div>
            ` : ''}
            
            <div class="order-total">
                <strong>Total:</strong> EGP ${total}
            </div>
            
            <div class="order-actions">
                ${order.status !== 'pending' ? '' : `
                    <button class="status-btn-small" onclick="updateOrderStatus(${order.id}, 'preparing')" 
                        style="background-color: #da0037; color: white;">Confirm Order</button>
                `}
                
                ${order.status !== 'preparing' ? '' : `
                    <button class="status-btn-small" onclick="updateOrderStatus(${order.id}, 'ready')" 
                        style="background-color: #28a745; color: white;">Mark as Ready</button>
                `}
                
                ${order.status !== 'ready' ? '' : `
                    <button class="status-btn-small" onclick="updateOrderStatus(${order.id}, 'completed')" 
                        style="background-color: #6c757d; color: white;">Complete Order</button>
                `}
            </div>
        `;
        
        ordersList.appendChild(orderElement);
    });
}

// Filter orders by status
function filterOrders(status) {
    // Update active button
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderOrders(status);
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        const activeFilter = document.querySelector('.status-btn.active').textContent.toLowerCase().replace(' orders', '');
        renderOrders(activeFilter === 'all' ? 'all' : activeFilter);
        showNotification(`Order #${orderId} status updated to ${newStatus}`);
    }
}

// Show notification
function showNotification(message) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.backgroundColor = '#28a745';
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout functions
function logoutConfirmed() {
    window.location.href = "../../SignIn/signin.html";
}

function hideLogoutConfirmation() {
    document.getElementById('logoutConfirmationDialog').style.display = 'none';
}

function showLogoutConfirmation() {
    document.getElementById('logoutConfirmationDialog').style.display = 'flex';
}

// Setup event listeners
function setupEventListeners() {
    // Logout confirmation dialog buttons
    document.getElementById('confirmLogoutBtn').addEventListener('click', logoutConfirmed);
    document.getElementById('cancelLogoutBtn').addEventListener('click', hideLogoutConfirmation);
}

// Make functions available globally
window.filterOrders = filterOrders;
window.updateOrderStatus = updateOrderStatus;
window.showLogoutConfirmation = showLogoutConfirmation;
window.hideLogoutConfirmation = hideLogoutConfirmation;