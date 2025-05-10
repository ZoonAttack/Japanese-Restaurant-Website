    document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

        const response = await fetch("/login", {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
            
            
        }, body: JSON.stringify(data),

    });

        if (!response.ok) {
            alert(response.text())
        }
        else {
            var responseBody = await response.json();
            var accessToken = responseBody.accessToken;
            var refreshToken = responseBody.refreshToken;

            sessionStorage.setItem("accessToken", accessToken);

            sessionStorage.setItem("accessToken", refreshToken)
            window.location.replace("/UserPage/dashboard/dashboard.html")
        }
});