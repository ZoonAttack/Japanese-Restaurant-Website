document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const data = {
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
        // Assign role after registration (optional)
        const res = await fetch("/assignrole", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                role: "user" // Specify role to be assigned
            })
        });

        if (res.ok) {
            window.location.replace("/SignIn/signin.html");
        } else {
            console.log("Role assignment failed: " + res.statusText);
        }
    } else {
        console.log("Registration failed: " + response.statusText);
    }
});
