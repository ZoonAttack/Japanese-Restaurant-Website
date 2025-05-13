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
        console.log(data);
        // Assign role after registration (optional)
        const res = await fetch("/assignrole", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                role: "user" // Specify role to be assigned
            })
        });

        if (res.ok) {
            window.location.replace("/SignIn/signin.html");
        } else {
            window.alert("Role assignment failed: " + res.statusText);
        }
    } else {
        window.alert("Registration failed: " + response.statusText);
    }
});
