async function regenerateToken() {
    var refreshToken = sessionStorage.getItem("refreshToken");

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

// DOM Elements
const ordersList = document.getElementById("ordersList")
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

// Current order being viewed
let currentOrder = null
// Order to be reordered
let orderToReorder = null

// Initialize the page
function init() {
  loadOrders()
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
  reorderBtn.addEventListener("click", showReorderConfirmation)

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
function loadOrders() {
  const orders = getOrders()

  if (orders.length === 0) {
    showEmptyState()
    return
  }

  hideEmptyState()
  //renderOrders(orders)
}

// Get orders from localStorage
async function getOrders() {
    try {
        const response = await authFetch("/getordersdata", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Error response:", errorText);
            alert(errorText);
        } else {
            const userData = await response.text();
            console.log("Fetched user data:", userData);

        }
    } catch (error) {
        console.log("Network or fetch error:", error);
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
function renderOrders(orders) {
  ordersList.innerHTML = ""

  orders.forEach((order) => {
    const orderCard = createOrderCard(order)
    ordersList.appendChild(orderCard)
  })
}

// Create order card element
function createOrderCard(order) {
  const orderCard = document.createElement("div")
  orderCard.className = "order-card"

  // Format date
  const orderDate = new Date(order.date)
  const formattedDate = formatDate(orderDate)

  // Get status class
  const statusClass = `status-${order.status.toLowerCase()}`

  // Create item previews (up to 3)
  const itemPreviews = order.items
    .slice(0, 3)
    .map((item) => {
      return `<div class="order-item-image" style="background-image: url('${item.image}')"></div>`
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
  viewDetailsBtn.addEventListener("click", () => {
    showOrderDetails(order)
  })

  // Add event listener to reorder button if it exists
  const reorderBtnElement = orderCard.querySelector(".reorder-btn")
  if (reorderBtnElement) {
    reorderBtnElement.addEventListener("click", () => {
      showReorderConfirmation(order)
    })
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
  const orderDate = new Date(order.date)
  const formattedDate = formatDate(orderDate)

  // Get status class
  const statusClass = `status-${order.status.toLowerCase()}`

  // Create items list
  const itemsList = order.items
    .map((item) => {
      return `
            <div class="order-details-item">
                <div class="order-details-item-image" style="background-image: url('${item.image}')"></div>
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
  printReceiptBtn.addEventListener("click", () => {
    printReceipt(order)
  })

  orderModal.classList.add("active")
}

// Hide order details modal
function hideOrderModal() {
  orderModal.classList.remove("active")
  currentOrder = null
}

// Show reorder confirmation modal
function showReorderConfirmation(order) {
  // If called from reorderBtn in order details modal
  if (!order) {
    order = currentOrder
    hideOrderModal()
  }
  
  orderToReorder = order
  
  // Create items list for reorder confirmation
  const itemsList = order.items
    .map((item, index) => {
      return `
            <div class="reorder-item" style="animation-delay: ${index * 0.05}s">
                <div class="reorder-item-image" style="background-image: url('${item.image}')"></div>
                <div class="reorder-item-details">
                    <div class="reorder-item-name">${item.name}</div>
                    <div class="reorder-item-price">EGP ${item.price}</div>
                </div>
                <div class="reorder-item-quantity">x${item.quantity}</div>
            </div>
        `
    })
    .join("")

  reorderItemsList.innerHTML = itemsList
  
  // Show total at the bottom
  reorderItemsList.innerHTML += `
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
function confirmReorderItems() {
  if (orderToReorder) {
    // Create a new cart from the order items
    localStorage.setItem("cart", JSON.stringify(orderToReorder.items))
    
    // Set a flag in localStorage to indicate the cart should be opened
    localStorage.setItem("openCart", "true")
    
    // Hide the reorder modal
    hideReorderModal()
    
    // Show success toast
    showReorderToast()
  }
}

// Show reorder success toast
function showReorderToast() {
  // Update the toast content to include the View Cart button
  const toastContent = document.querySelector(".toast-content p")
  if (toastContent) {
    toastContent.textContent = "Items added to cart!"
  }
  
  // Update the View Cart button
  const viewCartBtn = document.querySelector(".toast-actions .btn")
  if (viewCartBtn) {
    viewCartBtn.textContent = "View Cart"
    viewCartBtn.href = "javascript:void(0);"
    viewCartBtn.onclick = redirectToCartPage
  }
  
  reorderToast.classList.add("active")
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    reorderToast.classList.remove("active")
  }, 5000)
}

// Redirect to cart page with cart open
function redirectToCartPage() {
  // Set a flag in localStorage to indicate the cart should be opened
  localStorage.setItem("openCart", "true")
  
  // Redirect to the index page
  window.location.href = "../dashboard/dashboard.html";
}

// Filter orders based on search and filter
function filterOrders() {
  const searchTerm = orderSearch.value.toLowerCase()
  const filterValue = orderFilter.value

  let orders = getOrders()

  // Apply search filter
  if (searchTerm) {
    orders = orders.filter((order) => {
      // Search by order ID
      if (order.id.toString().includes(searchTerm)) {
        return true
      }

      // Search by items
      const hasMatchingItem = order.items.some((item) => item.name.toLowerCase().includes(searchTerm))

      return hasMatchingItem
    })
  }

  // Apply sort filter
  if (filterValue === "recent") {
    orders.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (filterValue === "oldest") {
    orders.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  if (orders.length === 0) {
    showEmptyState()
  } else {
    hideEmptyState()
    renderOrders(orders)
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  mobileMenu.classList.toggle("active")

  // Animate hamburger to X
  const spans = mobileMenuBtn.querySelectorAll("span")
  if (mobileMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
    spans[1].style.opacity = "0"
    spans[2].style.opacity = "0"
    spans[3].style.transform = "rotate(-45deg) translate(7px, -7px)"
  } else {
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.opacity = "1"
    spans[3].style.transform = "none"
  }
}

// Close mobile menu
function closeMobileMenu() {
  mobileMenu.classList.remove("active")

  // Reset hamburger icon
  const spans = mobileMenuBtn.querySelectorAll("span")
  spans[0].style.transform = "none"
  spans[1].style.opacity = "1"
  spans[2].style.opacity = "1"
  spans[3].style.transform = "none"
}

// Show logout confirmation modal
function showLogoutModal() {
  logoutModal.classList.add("active")
}

// Hide logout confirmation modal
function hideLogoutModal() {
  logoutModal.classList.remove("active")
}

// Handle logout confirmation
function handleLogout() {
  // Redirect to signin page
  window.location.href = "../../SignIn/signin.html"
}

// Print receipt
function printReceipt(order) {
  // Format date
  const orderDate = new Date(order.date)
  const formattedDate = formatDate(orderDate)

  // Create a new window for printing
  const printWindow = window.open("", "_blank")

  // Create receipt HTML
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - Order #${order.id.toString().slice(-6)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .receipt {
          max-width: 400px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .receipt-logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .receipt-details {
          margin-bottom: 20px;
        }
        .receipt-details div {
          margin-bottom: 5px;
        }
        .receipt-items {
          margin-bottom: 20px;
        }
        .receipt-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .receipt-item-name {
          flex: 1;
        }
        .receipt-item-price {
          text-align: right;
          margin-left: 10px;
        }
        .receipt-total {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }
        .receipt-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
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
          ${order.items
            .map(
              (item) => `
            <div class="receipt-item">
              <div class="receipt-item-name">${item.name} x ${item.quantity}</div>
              <div class="receipt-item-price">EGP ${item.price * item.quantity}</div>
            </div>
          `,
            )
            .join("")}
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
    </body>
    </html>
  `

  printWindow.document.write(receiptHTML)
  printWindow.document.close()
}

// Add sample orders for testing if none exist
function addSampleOrders() {
  const orders = getOrders()

  if (orders.length === 0) {
    // Sample order dates
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    // Sample orders
    const sampleOrders = [
      {
        id: Date.now() - 1000000,
        date: today.toISOString(),
        items: [
          { ...menuItems[0], quantity: 2 },
          { ...menuItems[3], quantity: 1 },
        ],
        total: menuItems[0].price * 2 + menuItems[3].price,
        status: "Processing",
      },
      {
        id: Date.now() - 2000000,
        date: yesterday.toISOString(),
        items: [
          { ...menuItems[1], quantity: 1 },
          { ...menuItems[5], quantity: 1 },
        ],
        total: menuItems[1].price + menuItems[5].price,
        status: "Completed",
      },
      {
        id: Date.now() - 3000000,
        date: lastWeek.toISOString(),
        items: [
          { ...menuItems[2], quantity: 1 },
          { ...menuItems[4], quantity: 2 },
          { ...menuItems[7], quantity: 1 },
        ],
        total: menuItems[2].price + menuItems[4].price * 2 + menuItems[7].price,
        status: "Completed",
      },
    ]

    localStorage.setItem("orders", JSON.stringify(sampleOrders))
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Add sample orders for testing
  //addSampleOrders()

  init()
})