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

// Menu items data
const menuItems = [];

// Track item pending deletion
let itemToDelete = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    getMenuData()
    renderMenuItems();
    setupEventListeners();
});
async function getMenuData() {
    try {
        const response = await authFetch('chef/getmenudata');

        if (!response.ok) {
            const errorText = await response.text();
            alert(errorText);
            return;
        }

        const items = await response.json();
        menuItems = items; // Save globally if needed

    } catch (error) {
        console.error("Failed to load menu items:", error);
        alert("An error occurred while loading menu items.");
    }
}
// Render all menu items
function renderMenuItems() {
    const menuGrid = document.getElementById('menu-items');
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.dataset.id = item.id;
        
        itemElement.innerHTML = `
            <div class="item-image" style="background-image: url('${item.pictureUrl}')"></div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">EGP ${item.price}</p>
                <div class="item-actions">
                    <button class="edit-btn" onclick="openEditPopup(${item.id})">Edit Item</button>
                    <button class="delete-btn" onclick="showDeleteConfirmation(${item.id})">Delete Item</button>
                </div>
            </div>
        `;
        
        menuGrid.appendChild(itemElement);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Edit form submission
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMenuItem();
    });
    
    // Close popup when clicking outside
    document.getElementById('editPopup').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditPopup();
        }
    });
    
    // Delete confirmation dialog buttons
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteConfirmed);
    document.getElementById('cancelDeleteBtn').addEventListener('click', hideDeleteConfirmation);
    
    // Logout confirmation dialog buttons
    document.getElementById('confirmLogoutBtn').addEventListener('click', logoutConfirmed);
    document.getElementById('cancelLogoutBtn').addEventListener('click', hideLogoutConfirmation);
    
    // Close dialogs when clicking outside
    document.getElementById('confirmationDialog').addEventListener('click', function(e) {
        if (e.target === this) {
            hideDeleteConfirmation();
        }
    });
    
    document.getElementById('logoutConfirmationDialog').addEventListener('click', function(e) {
        if (e.target === this) {
            hideLogoutConfirmation();
        }
    });
}

// Open edit popup with item data
function openEditPopup(itemId) {
    const item = menuItems.find(i => i.id == itemId);
    if (!item) return;
    
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemDescription').value = item.description;
    document.getElementById('editPopup').style.display = 'flex';
}

// Close edit popup
function closeEditPopup() {
    document.getElementById('editPopup').style.display = 'none';
    document.getElementById('editForm').reset();
}

// Save menu item changes
function saveMenuItem() {
    const itemId = parseInt(document.getElementById('editItemId').value);
    const itemIndex = menuItems.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return;
    
    // Update item data
    menuItems[itemIndex] = {
        ...menuItems[itemIndex],
        name: document.getElementById('editItemName').value,
        price: parseFloat(document.getElementById('editItemPrice').value),
        description: document.getElementById('editItemDescription').value
    };
    
    // Handle image upload if changed
    const imageInput = document.getElementById('editItemImage');
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            menuItems[itemIndex].image = e.target.result;
            renderMenuItems(); // Re-render to show new image
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
    
    closeEditPopup();
    renderMenuItems();
    showNotification('Item updated successfully!');
}

// Show delete confirmation dialog
function showDeleteConfirmation(itemId) {
    itemToDelete = itemId;
    document.getElementById('confirmationDialog').style.display = 'flex';
}

// Hide delete confirmation dialog
function hideDeleteConfirmation() {
    itemToDelete = null;
    document.getElementById('confirmationDialog').style.display = 'none';
}

// Handle confirmed deletion
function deleteConfirmed() {
    if (itemToDelete) {
        const itemIndex = menuItems.findIndex(i => i.id === itemToDelete);
        if (itemIndex !== -1) {
            menuItems.splice(itemIndex, 1);
            renderMenuItems();
            showNotification('Item deleted successfully!');
        }
    }
    hideDeleteConfirmation();
}

// Show logout confirmation dialog
function showLogoutConfirmation() {
    document.getElementById('logoutConfirmationDialog').style.display = 'flex';
}

// Hide logout confirmation dialog
function hideLogoutConfirmation() {
    document.getElementById('logoutConfirmationDialog').style.display = 'none';
}

// Handle confirmed logout
async function logoutConfirmed() {
    // Redirect to signin page
    const response = await authFetch("chef/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        sessionStorage.clear();
        window.location.replace("/SignIn/signin.html")
    }
    else {
        alert(response.text())
    }
}

// Show notification message
function showNotification(message) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

// Make functions available globally
window.openEditPopup = openEditPopup;
window.closeEditPopup = closeEditPopup;
window.showDeleteConfirmation = showDeleteConfirmation;
window.hideDeleteConfirmation = hideDeleteConfirmation;
window.showLogoutConfirmation = showLogoutConfirmation;
window.hideLogoutConfirmation = hideLogoutConfirmation;