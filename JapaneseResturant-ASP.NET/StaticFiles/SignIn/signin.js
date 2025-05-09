// Function to validate login credentials
function validateLogin(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Get form values
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    // Log the form data (for debugging only)
    console.log('Login form submitted with the following data:');
    console.log('Phone:', phone);
    console.log('Password:', password);
    
    // Check login credentials
    if (phone === '0' && password === '852130') {
        // Show success notification for admin and redirect
        showModal('success', 'Sign In Successful', 'Redirecting to dashboard...', '../UserPage/dashboard/dashboard.html');
    } 
    else if (phone === '1' && password === '852130') {
        // Show success notification for chef and redirect
        showModal('success', 'Sign In Successful', 'Redirecting to chef menu items...', '../ChefPage/ChefMenuItemsPage/chefmenuitems.html');
    }
    else {
        // Show error notification for incorrect credentials
        showModal('error', 'Sign In Failed', 'Wrong credentials. Please try again.');
        // Only reset the password field
        document.getElementById('password').value = '';
    }
}

// Function to display a modal notification
function showModal(type, title, message, redirectUrl = null) {
    // Remove any existing modal
    const existingModal = document.getElementById('notification-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop) {
        existingBackdrop.remove();
    }
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.id = 'notification-modal';
    
    // Create icon based on type
    const icon = document.createElement('div');
    icon.className = 'modal-icon';
    if (type === 'success') {
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    } else if (type === 'error') {
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>';
    }
    
    // Create title element
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    // Create message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons';
    
    // If this is a success message with redirect
    if (redirectUrl) {
        // Create OK button
        const okButton = document.createElement('button');
        okButton.className = 'modal-button primary';
        okButton.textContent = 'OK';
        okButton.addEventListener('click', function() {
            modal.remove();
            backdrop.remove();
            window.location.href = redirectUrl;
        });
        buttonContainer.appendChild(okButton);
        
        // Auto redirect after 2 seconds
        setTimeout(function() {
            window.location.href = redirectUrl;
        }, 2000);
    } 
    // If this is an error message
    else {
        // Create Try Again button
        const tryAgainButton = document.createElement('button');
        tryAgainButton.className = 'modal-button primary';
        tryAgainButton.textContent = 'Try Again';
        tryAgainButton.addEventListener('click', function() {
            modal.remove();
            backdrop.remove();
        });
        buttonContainer.appendChild(tryAgainButton);
    }
    
    // Assemble the modal
    modal.appendChild(icon);
    modal.appendChild(titleElement);
    modal.appendChild(messageElement);
    modal.appendChild(buttonContainer);
    
    // Add modal and backdrop to the page
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const loginForm = document.getElementById('loginForm');
    
    // Add submit event listener
    loginForm.addEventListener('submit', validateLogin);
});