async function regenerateToken() {
    var refreshToken = sessionStorage.getItem("refreshToken");
    console.log(refreshToken);
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
export async function authFetch(input, init = {}) {
    let token = sessionStorage.getItem('accessToken');
    console.log(token);
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

export function tokenCheck() {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.replace('/SignIn/signin.html');  // no token → redirect
        return;
    }
}