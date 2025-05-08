// Sample orders data
const orders = [
    {
        id: 1001,
        customer: "Mohamed Ali",
        time: "2023-05-15T12:30:00",
        status: "pending",
        items: [
            { name: "Sushi", quantity: 2, price: 80 },
            { name: "Miso Soup", quantity: 1, price: 60 }
        ],
        notes: "Extra wasabi please"
    },
    {
        id: 1002,
        customer: "Ahmed Samy",
        time: "2023-05-15T12:45:00",
        status: "preparing",
        items: [
            { name: "Ramen", quantity: 1, price: 100 },
            { name: "Onigiri", quantity: 3, price: 75 }
        ]
    },
    {
        id: 1003,
        customer: "Yasmin Hany",
        time: "2023-05-15T13:00:00",
        status: "ready",
        items: [
            { name: "Tonkatsu", quantity: 1, price: 120 },
            { name: "Yakisoba", quantity: 1, price: 100 }
        ],
        notes: "No pork in the yakisoba please"
    },
    {
        id: 1004,
        customer: "Omar Khaled",
        time: "2023-05-15T13:15:00",
        status: "completed",
        items: [
            { name: "Tempura", quantity: 1, price: 130 },
            { name: "Curry Rice", quantity: 1, price: 90 }
        ]
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderOrders();
    setupEventListeners();
});

// Render all orders
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