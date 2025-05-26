function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill in all fields!");
        return;
    }

    const data = { username: username, password: password };

    console.log("Sending data:", data);  

    fetch('https://jogabonitooo-back.cluster-ig3.igpolytech.fr/register', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
        mode: 'cors', 
        credentials: 'include'  
    })
    .then(response => {
        console.log("Response status:", response.status);  
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(responseData => {
        console.log("Response data:", responseData);  
        alert("Registration successful! Please login.");
        const userId = responseData.userId; 
        if (userId) {
            localStorage.setItem(`basket_${userId}`, JSON.stringify([]));
            localStorage.setItem("userId", userId); 
     }
        window.location.href = 'login.html'; 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    });
}
