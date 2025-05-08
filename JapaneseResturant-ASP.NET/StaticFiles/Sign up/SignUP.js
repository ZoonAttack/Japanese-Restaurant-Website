// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-icon">
            <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="none" stroke="currentColor" stroke-width="2" d="M20,6L9,17l-5-5"></path>
            </svg>
        </div>
        <div class="success-text">
            <h3>Sign Up Successful!</h3>
            <p>Redirecting to login page...</p>
        </div>
    `;
    document.body.appendChild(successMessage);
    
    // Get the form element
    const signupForm = document.getElementById('signupForm');
    
    // Add submit event listener
    signupForm.addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!name || !phone || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Store user data in localStorage (in a real app, you'd send this to a server)
        const userData = {
            name: name,
            phone: phone,
            password: password
        };
        
        // Save to localStorage
        localStorage.setItem('userData_' + phone, JSON.stringify(userData));
        
        // Hide the form container
        document.querySelector('.signup-form-wrapper').style.opacity = '0';
        
        // Show success message with animation
        setTimeout(() => {
            successMessage.classList.add('show');
            
            // Redirect after showing the message
            setTimeout(() => {
                window.location.href = '../SignIn/signin.html';
            }, 2000); // Redirect after 2 seconds
        }, 300);
    });
});