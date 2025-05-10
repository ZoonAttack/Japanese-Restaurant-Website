    document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch("/register", {
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
            window.alert(response.statusText);
        }
        
});