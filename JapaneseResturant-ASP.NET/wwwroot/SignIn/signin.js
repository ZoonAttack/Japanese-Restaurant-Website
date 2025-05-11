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

        // Optional: log the token to debug
        console.log("accessToken:", data.accessToken);
        console.log("refreshToken:", data.refreshToken);

        // Redirect only if login is successful
        window.location.replace("/UserPage/dashboard/dashboard.html");
    } else {
        const error = await response.text();
        alert("Login failed: " + error);
    }
});
