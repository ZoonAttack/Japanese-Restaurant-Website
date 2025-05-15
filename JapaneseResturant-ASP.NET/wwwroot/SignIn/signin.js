document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();

        // Store tokens properly
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);

        // If login is successful, fetch the user's roles
        const res = await fetch("/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.accessToken}` // Include the token in the Authorization header
            }
        });

        const userData = await res.json();
        if (userData.roles.includes("user")) {
            window.location.replace("/UserPage/dashboard.html");
        }
        else {
            window.location.replace("/ChefPage/chefmenuitems.html");
        }
    } else {
        const error = await response.text();
        alert("Login failed: " + error);
    }
});
