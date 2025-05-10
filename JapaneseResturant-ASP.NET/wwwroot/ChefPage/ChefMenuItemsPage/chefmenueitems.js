// Menu items data
const menuItems = [
    {
        id: 1,
        name: "Sushi",
        price: 80,
        description: "Fresh raw fish over rice",
        image: "https://static.tildacdn.info/tild6461-6235-4466-b438-303030376464/close-up-plate-with-.jpg"
    },
    {
        id: 2,
        name: "Ramen",
        price: 100,
        description: "Japanese noodle soup",
        image: "https://static.tildacdn.info/tild6634-3632-4466-b430-363130383564/ramen.jpg"
    },
    {
        id: 3,
        name: "Yakisoba",
        price: 100,
        description: "Stir-fried noodles",
        image: "https://static.tildacdn.info/tild6131-3637-4736-a331-636438333435/Chicken-Yakisoba.jpg"
    },
    {
        id: 4,
        name: "Tonkatsu",
        price: 120,
        description: "Breaded pork cutlet",
        image: "https://static.tildacdn.info/tild3033-3561-4332-b864-356639313161/Tonkatsu.jpg"
    },
    {
        id: 5,
        name: "Onigiri",
        price: 75,
        description: "Rice ball with filling",
        image: "https://static.tildacdn.info/tild3461-3031-4364-b265-333132343337/Onigiri.jpg"
    },
    {
        id: 6,
        name: "Miso Soup",
        price: 60,
        description: "Traditional Japanese soup",
        image: "https://static.tildacdn.info/tild6134-3431-4565-b238-343061333238/steaming-bowl-miso-s.jpg"
    }
];

// Track item pending deletion
let itemToDelete = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderMenuItems();
    setupEventListeners();
});

// Render all menu items
function renderMenuItems() {
    const menuGrid = document.getElementById('menu-items');
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.dataset.id = item.id;
        
        itemElement.innerHTML = `
            <div class="item-image" style="background-image: url('${item.image}')"></div>
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
function logoutConfirmed() {
    // In a real app, you would typically:
    // 1. Clear session data
    // 2. Send logout request to server
    // 3. Then redirect to login page
    
    // For this demo, we'll just redirect immediately
    window.location.href = "../../SignIn/signin.html";
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