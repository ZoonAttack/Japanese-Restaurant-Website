import { authFetch, tokenCheck } from "/Modules/token.js";

// DOM Elements
const orders = document.getElementById("ordersList")
const emptyOrders = document.getElementById("emptyOrders")
const orderSearch = document.getElementById("orderSearch")
const orderFilter = document.getElementById("orderFilter")
const orderModal = document.getElementById("orderModal")
const closeOrderModal = document.getElementById("closeOrderModal")
const orderModalBody = document.getElementById("orderModalBody")
const closeOrderDetails = document.getElementById("closeOrderDetails")
const reorderBtn = document.getElementById("reorderBtn")
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileMenu = document.getElementById("mobileMenu")
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

// Reorder Modal Elements
const reorderModal = document.getElementById("reorderModal")
const closeReorderModal = document.getElementById("closeReorderModal")
const cancelReorder = document.getElementById("cancelReorder")
const confirmReorder = document.getElementById("confirmReorder")
const reorderItemsList = document.getElementById("reorderItemsList")
const reorderToast = document.getElementById("reorderToast")

// Logout Modal Elements
const logoutBtn = document.getElementById("logoutBtn")
const logoutModal = document.getElementById("logoutModal")
const closeLogoutModal = document.getElementById("closeLogoutModal")
const cancelLogout = document.getElementById("cancelLogout")
const confirmLogout = document.getElementById("confirmLogout")

// Menu Items Data (for reference in order details)
const menuItems = []
let orderList = []
// Current order being viewed
let currentOrder = null
// Order to be reordered
let orderToReorder = null

// Initialize the page
async function init() {
    tokenCheck();
    await loadOrders()
    setupEventListeners()
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    orderSearch.addEventListener("input", filterOrders)
    orderFilter.addEventListener("change", filterOrders)

    // Order modal
    closeOrderModal.addEventListener("click", hideOrderModal)
    closeOrderDetails.addEventListener("click", hideOrderModal)

    // CARD-level “Reorder” buttons get wired up in createOrderCard(order)

    // MODAL-level “Reorder” button:
    // wrap it so it uses our currentOrder instead of the click event
    reorderBtn.addEventListener("click", () => showReorderConfirmation())

    // Reorder modal
    closeReorderModal.addEventListener("click", hideReorderModal)
    cancelReorder.addEventListener("click", hideReorderModal)
    confirmReorder.addEventListener("click", confirmReorderItems)

    // Mobile menu toggle
    mobileMenuBtn.addEventListener("click", toggleMobileMenu)

    // Close mobile menu when clicking a link
    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu)
    })

    // Logout button and modal
    logoutBtn.addEventListener("click", showLogoutModal)
    closeLogoutModal.addEventListener("click", hideLogoutModal)
    cancelLogout.addEventListener("click", hideLogoutModal)
    confirmLogout.addEventListener("click", handleLogout)

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === orderModal) {
            hideOrderModal()
        }
        if (event.target === logoutModal) {
            hideLogoutModal()
        }
        if (event.target === reorderModal) {
            hideReorderModal()
        }
    })

    // Setup view cart button in toast
    const viewCartBtn = document.querySelector(".toast-actions .btn")
    if (viewCartBtn) {
        viewCartBtn.addEventListener("click", (e) => {
            e.preventDefault()
            redirectToCartPage()
        })
    }
}

// Load orders from localStorage
async function loadOrders() {
    orderList = await getOrders()
    if (orderList.length === 0) {
        showEmptyState()
        return
    }

    hideEmptyState()
    renderOrders()
}

// Get orders from localStorage
async function getOrders() {
    try {
        const response = await authFetch("getordersdata", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.json();
            alert(errorText);
        } else {
            const userData = await response.json();

            return userData;
        }
    } catch (error) {
        //console.log("Network or fetch error:", error);
        alert("An error occurred while fetching orders.");
    }
}

// Show empty state
function showEmptyState() {
    emptyOrders.style.display = "block"
}

// Hide empty state
function hideEmptyState() {
    emptyOrders.style.display = "none"
}

// Render orders
function renderOrders() {
    orders.innerHTML = ""

    orderList.forEach((order) => {
        const orderCard = createOrderCard(order)
        orders.appendChild(orderCard)
    })
}

// Create order card element
function createOrderCard(order) {
    const orderCard = document.createElement("div")
    orderCard.className = "order-card"

    // Format date
    const orderDate = new Date(order.orderDate)
    const formattedDate = formatDate(orderDate)

    // Get status class
    const statusClass = `status-${order.status.toLowerCase()}`

    // Create item previews (up to 3)
    const itemPreviews = order.items
        .slice(0, 3)
        .map((item) => {
            return `<div class="order-item-image" style="background-image: url('${item.pictureUrl}')"></div>`
        })
        .join("")

    // Additional items count
    const additionalItems =
        order.items.length > 3 ? `<div class="order-items-count">+${order.items.length - 3} more</div>` : ""

    orderCard.innerHTML = `
        <div class="order-header">
            <div class="order-id">Order #${order.id.toString().slice(-6)}</div>
            <div class="order-date">${formattedDate}</div>
        </div>
        <div class="order-content">
            <div class="order-summary">
                <div class="order-items-preview">
                    ${itemPreviews}
                    ${additionalItems}
                </div>
                <div class="order-total">EGP ${order.total}</div>
            </div>
            <div class="order-status ${statusClass}">${order.status}</div>
            <div class="order-actions">
                <button class="btn btn-secondary view-details-btn" data-id="${order.id}">View Details</button>
                ${order.status === "Completed" ? `<button class="btn btn-primary reorder-btn" data-id="${order.id}">Reorder</button>` : ""}
            </div>
        </div>
    `

    // Add event listener to view details button
    const viewDetailsBtn = orderCard.querySelector(".view-details-btn")
    viewDetailsBtn.addEventListener("click", () => showOrderDetails(order))

    // Add event listener to card-level reorder button if it exists
    const reorderBtnElement = orderCard.querySelector(".reorder-btn")
    if (reorderBtnElement) {
        reorderBtnElement.addEventListener("click", () => showReorderConfirmation(order))
    }

    return orderCard
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

// Show order details modal
function showOrderDetails(order) {
    currentOrder = order

    // Format date
    const orderDate = new Date(order.orderDate)
    const formattedDate = formatDate(orderDate)

    // Get status class
    const statusClass = `status-${order.status.toLowerCase()}`

    // Create items list
    const itemsList = order.items
        .map((item) => {
            return `
            <div class="order-details-item">
                <div class="order-details-item-image" style="background-image: url('${item.pictureUrl}')"></div>
                <div class="order-details-item-info">
                    <div class="order-details-item-name">${item.name}</div>
                    <div class="order-details-item-price">EGP ${item.price}</div>
                </div>
                <div class="order-details-item-quantity">x${item.quantity}</div>
            </div>
        `
        })
        .join("")

    orderModalBody.innerHTML = `
        <div class="order-details-header">
            <div class="order-details-id">Order #${order.id.toString().slice(-6)}</div>
            <div class="order-details-date">${formattedDate}</div>
            <div class="order-details-status">
                <span class="order-status ${statusClass}">${order.status}</span>
            </div>
        </div>
        <div class="order-details-items">
            ${itemsList}
        </div>
        <div class="order-details-total">
            <span>Total:</span>
            <span>EGP ${order.total}</span>
        </div>
        <div class="print-receipt-wrapper">
            <button class="print-receipt" id="printReceiptBtn" data-id="${order.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9V2h12v7"></path>
                    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                    <path d="M6 14h12v8H6z"></path>
                </svg>
                Print Receipt
            </button>
        </div>
    `

    // Add event listener to print receipt button
    const printReceiptBtn = orderModalBody.querySelector("#printReceiptBtn")
    printReceiptBtn.addEventListener("click", () => printReceipt(order))

    orderModal.classList.add("active")
}

// Hide order details modal
function hideOrderModal() {
    orderModal.classList.remove("active")
    currentOrder = null
}

// Show reorder confirmation modal
function showReorderConfirmation(order) {
    // If called without an order argument, fall back to the one we stashed
    if (!order) {
        order = currentOrder
        hideOrderModal()
    }

    if (order.status !== "Pending" && order.status !== "Completed") {
        alert("Order is already being made!")
        return
    }

    orderToReorder = order

    const items = Array.isArray(order.items) ? order.items : []

    const itemsList = items
        .map((item, index) => `
      <div class="reorder-item" style="animation-delay: ${index * 0.05}s">
        <div class="reorder-item-image" style="background-image: url('${item.pictureUrl}')"></div>
        <div class="reorder-item-details">
          <div class="reorder-item-name">${item.name}</div>
          <div class="reorder-item-price">EGP ${item.price}</div>
        </div>
        <div class="reorder-item-quantity">x${item.quantity}</div>
      </div>
    `)
        .join("")

    reorderItemsList.innerHTML = itemsList + `
    <div class="order-details-total">
      <span>Total:</span>
      <span>EGP ${order.total}</span>
    </div>
  `
    reorderModal.classList.add("active")
}

// Hide reorder confirmation modal
function hideReorderModal() {
    reorderModal.classList.remove("active")
    orderToReorder = null
}

// Confirm reorder and add items to cart
async function confirmReorderItems() {
    if (orderToReorder) {
        const payload = {
            date: new Date().toISOString(),
            note: "hey",
            items: orderToReorder.items.map(item => ({
                productId: item.dishId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: orderToReorder.total
        };

        try {
            const res = await authFetch('updateorders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error('Failed to checkout');
            }

            alert("Success")
        } catch (error) {
            //console.error('Checkout error:', error);
        }
        hideReorderModal()
        location.reload();
    }
}

// Show reorder success toast

// Redirect to cart page with cart open
function redirectToCartPage() {
    localStorage.setItem("openCart", "true")
    window.location.replace("/UserPage/dashboard.html");
}

// Filter orders based on search and filter
async function filterOrders() {
    const searchTerm = orderSearch.value.toLowerCase()
    const filterValue = orderFilter.value

    let filtered = [...orderList]

    if (searchTerm) {
        filtered = filtered.filter((order) => {
            if (order.id.toString().includes(searchTerm)) return true
            return order.items.some((item) => item.name.toLowerCase().includes(searchTerm))
        })
    }

    if (filterValue === "recent") {
        filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    } else if (filterValue === "oldest") {
        filtered.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate))
    }

    if (filtered.length === 0) {
        showEmptyState()
    } else {
        hideEmptyState()
        orders.innerHTML = ""
        filtered.forEach((order) => orders.appendChild(createOrderCard(order)))
    }
}

// Mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle("active")
    const spans = mobileMenuBtn.querySelectorAll("span")
    if (mobileMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.opacity = "0"
        spans[3].style.transform = "rotate(-45deg) translate(7px, -7px)"
    } else {
        spans.forEach(s => {
            s.style.transform = "none"
            s.style.opacity = "1"
        })
    }
}

function closeMobileMenu() {
    mobileMenu.classList.remove("active")
    mobileMenuBtn.querySelectorAll("span").forEach(s => {
        s.style.transform = "none"
        s.style.opacity = "1"
    })
}

// Logout
function showLogoutModal() {
    logoutModal.classList.add("active")
}
function hideLogoutModal() {
    logoutModal.classList.remove("active")
}

async function handleLogout() {
    const response = await authFetch("logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
        sessionStorage.clear();
        window.location.replace("/SignIn/signin.html")
    } else {
        alert(await response.text())
    }
}

// Print receipt
function printReceipt(order) {
    const orderDate = new Date(order.orderDate)
    const formattedDate = formatDate(orderDate)
    const printWindow = window.open("", "_blank")
    const receiptHTML = `
    <!DOCTYPE html><html><head><title>Receipt - Order #${order.id.toString().slice(-6)}</title><style>
      /* ...styles… */
    </style></head><body>
      <div class="receipt">
        <div class="receipt-header">
          <div class="receipt-logo">弁当クリック</div>
          <div>Japanese Restaurant</div>
        </div>
        <div class="receipt-details">
          <div><strong>Order #:</strong> ${order.id.toString().slice(-6)}</div>
          <div><strong>Date:</strong> ${formattedDate}</div>
          <div><strong>Status:</strong> ${order.status}</div>
        </div>
        <div class="receipt-items">
          <h3>Items</h3>
          ${order.items.map(item => `
            <div class="receipt-item">
              <div class="receipt-item-name">${item.name} x ${item.quantity}</div>
              <div class="receipt-item-price">EGP ${item.price * item.quantity}</div>
            </div>
          `).join("")}
        </div>
        <div class="receipt-total">
          <div>Total:</div>
          <div>EGP ${order.total}</div>
        </div>
        <div class="receipt-footer">
          <p>Thank you for your order!</p>
          <p>弁当クリック - E-JUST Restaurant</p>
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body></html>
  `
    printWindow.document.write(receiptHTML)
    printWindow.document.close()
}

document.addEventListener("DOMContentLoaded", init)
