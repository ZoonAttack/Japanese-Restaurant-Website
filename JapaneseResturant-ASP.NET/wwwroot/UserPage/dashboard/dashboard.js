import { regenereateToken } from "/Modules/token.js";
// Cart State
let cart = [];

// DOM Elements
const menuGrid = document.querySelector('.menu-grid');
const cartCounter = document.getElementById('cartCounter');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Logout Modal Elements
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const closeLogoutModal = document.getElementById('closeLogoutModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

// Initialize the page
function init() {
    //getUserData();
    getMenuData();
    setupEventListeners();
    setupIngredientsModal();
}

// Setup ingredients modal event listeners
function setupIngredientsModal() {
    // Make sure the ingredients modal close buttons work
    const closeIngredientsModal = document.getElementById('closeIngredientsModal');
    const closeIngredientsBtn = document.getElementById('closeIngredientsBtn');
    const ingredientsModalOverlay = document.querySelector('#ingredientsModal .modal-overlay');

    if (closeIngredientsModal) {
        closeIngredientsModal.addEventListener('click', function () {
            document.getElementById('ingredientsModal').classList.remove('active');
        });
    }

    if (closeIngredientsBtn) {
        closeIngredientsBtn.addEventListener('click', function () {
            document.getElementById('ingredientsModal').classList.remove('active');
        });
    }

    if (ingredientsModalOverlay) {
        ingredientsModalOverlay.addEventListener('click', function () {
            document.getElementById('ingredientsModal').classList.remove('active');
        });
    }
}

// Show ingredients modal
function showIngredients(title, ingredients) {
    const modal = document.getElementById('ingredientsModal');
    const modalTitle = document.getElementById('ingredientsModalTitle');
    const ingredientsContent = document.getElementById('ingredientsContent');

    // Set the title and ingredients
    modalTitle.textContent = title + " Ingredients";

    // Create ingredients list
    let ingredientsList = '<ul class="ingredients-list">';
    ingredients.forEach(ingredient => {
        ingredientsList += `<li>${ingredient}</li>`;
    });
    ingredientsList += '</ul>';

    ingredientsContent.innerHTML = ingredientsList;

    // Show the modal
    modal.classList.add('active');
}
// Render menu items
function renderMenuItems() {
    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-item-image" style="background-image: url('${item.image}')" data-id="${item.id}"></div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3 class="menu-item-title">${item.name}</h3>
                    <p class="menu-item-price">EGP ${item.price}</p>
                </div>
                <button class="btn btn-primary btn-add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });

    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
        });
    });

    // Add event listeners to dish images for showing ingredients
    const dishImages = document.querySelectorAll('.menu-item-image');
    dishImages.forEach(image => {
        image.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            const item = menuItems.find(item => item.id === itemId);
            if (item && item.ingredients) {
                showIngredients(item.name, item.ingredients);
            }
        });
    });
}
// Setup event listeners
function setupEventListeners() {
    // Toggle cart modal
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);

    // Checkout button
    checkoutBtn.addEventListener('click', checkout);

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Logout button and modal
    logoutBtn.addEventListener('click', showLogoutModal);
    closeLogoutModal.addEventListener('click', hideLogoutModal);
    cancelLogout.addEventListener('click', hideLogoutModal);
    confirmLogout.addEventListener('click', handleLogout);

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === logoutModal) {
            hideLogoutModal();
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 95, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);

    if (!item) return;

    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    updateCart();
}

// Remove item from cart
function removeFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);

    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }

        updateCart();
    }
}

// Update cart UI
function updateCart() {
    // Update cart counter
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = totalItems;

    // Update cart items
    renderCartItems();

    // Update cart total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `EGP ${total}`;

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h19l-3 10H6L3 6z"></path>
                    <path d="M8 18a2 2 0 100 4 2 2 0 000-4z"></path>
                    <path d="M19 18a2 2 0 100 4 2 2 0 000-4z"></path>
                </svg>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">EGP ${item.price} × ${item.quantity}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">&times;</button>
        `;
        cartItems.appendChild(cartItem);
    });

    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            // Remove all quantities of this item
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        });
    });
}

// Toggle cart modal
function toggleCart() {
    cartModal.classList.toggle('active');
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');

    // Animate hamburger to X
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.opacity = '0';
        spans[3].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.opacity = '1';
        spans[3].style.transform = 'none';
    }
}

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');

    // Reset hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.opacity = '1';
    spans[3].style.transform = 'none';
}

// Show logout confirmation modal
function showLogoutModal() {
    logoutModal.classList.add('active');
}

// Hide logout confirmation modal
function hideLogoutModal() {
    logoutModal.classList.remove('active');
}

// Handle logout confirmation
async function handleLogout() {
    // Redirect to signin page
    const response = await fetch("/dashboard/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.replace("/SignIn/signin.html")
    }
    else {
        alert(response.text())
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert('Thank you for your order!');
    cart = [];
    updateCart();
    toggleCart();
}

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}
async function getUserData()
{
    const response = await fetch("dashboard/getuserdata", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        alert(response.text())

    }
    else {
        const userData = await response.json();


    }
}

async function getMenuData()
{
    const response = await fetch("dashboard/getmenudata", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) {
        alert(response.text())

    }
    else {
        alert(response.text())
        const items = await response.json();
        items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = 'menu-item';
            itemDiv.innerHTML = `
            <div class="menu-item-image" style="background-image: url('${item.image}')"></div>
            <div class="menu-item-details">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-price">EGP ${item.price}</p>
                <button class="btn btn-add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
            menuGrid.appendChild(itemDiv);
        });
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', function () {
                const itemId = parseInt(this.getAttribute('data-id'));
                addToCart(itemId);
            });
        });
    }
}
// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    init();
    loadCart();
});