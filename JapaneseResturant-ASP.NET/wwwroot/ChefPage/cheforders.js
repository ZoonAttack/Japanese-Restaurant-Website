import { authFetch, tokenCheck } from "/Modules/token.js";

    // Sample orders data
let orders = [];
async function init() {
    tokenCheck();
    await getOrders();
    renderOrders();
    setupEventListeners();
}
// Initialize the page
document.addEventListener("DOMContentLoaded", init)


async function getOrders() {
    const response = await authFetch('getordersdata', {

        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.ok) {

        orders = await response.json();
=        renderOrders();
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
        
        const orderTime = new Date(order.orderDate);
        const timeString = orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Status class
        const statusClass = `status-${order.status}`;
        const statusText = {
            Pending: "Pending Confirmation",
            In_Prgress: "Preparing",
            Ready: "Ready for Pickup",
            Completed: "Completed"
        }[order.status];

        let username = order.customer.split('@')[0];

        orderElement.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-time">${timeString}</span>
                </div>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            
            <div class="order-customer">
                <strong>Customer:</strong> ${username}
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>EGP ${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            
            ${order.note ? `
            <div class="order-notes">
                <strong>Notes:</strong> ${order.note}
            </div>
            ` : ''}
            
            <div class="order-total">
                <strong>Total:</strong> EGP ${order.total}
            </div>
            
            <div class="order-actions">
                ${order.status !== 'Pending' ? '' : `
                    <button class="status-btn-small" onclick="updateOrderStatus(${order.id}, 'In_Prgress')" 
                        style="background-color: #da0037; color: white;">Confirm Order</button>
                `}
                
                ${order.status !== 'In_Prgress' ? '' : `
                    <button class="status-btn-small" onclick="updateOrderStatus(${order.id}, 'Ready')" 
                        style="background-color: #28a745; color: white;">Mark as Ready</button>
                `}
                
                ${order.status !== 'Ready' ? '' : `
                    <button class="status-btn-small" onclick="updateOrderStatus(${order.id}, 'Completed')" 
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
async function updateOrderStatus(orderId, newStatus) {
=    const response = await authFetch('updateorderstatus', {

        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({orderId, status: newStatus})
    })
    if (response.ok) {
        location.reload();
    }
    else {
        showNotification('something went wrong', response.text());
    }
}
//async function getStatus(orderId) {
//    var status;
//    const response = await authFetch('getnextstatus', {

//        method: 'GET',
//        headers: {
//            "Content-Type": "application/json"
//        },
//        body: orderId
//    })
//    if (response.ok) {
//        return await response.json();
//    }
//    return null;
//}
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
async function logoutConfirmed() {
    const response = await authFetch('logout', {

        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.ok) {
        sessionStorage.clear();
        window.location.replace("/SignIn/signin.html");
    }
    else {
        showNotification('something went wrong', response.text());
    }
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