function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill in all fields!");
        return;
    }

    const data = { username: username, password: password };

    console.log("Sending data:", data);  // Log des données envoyées

    fetch('httpS://jogabonitooo-back.cluster-ig3.igpolytech.fr:8080/register', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
        mode: 'cors', // Important pour éviter les erreurs CORS
        credentials: 'include'  // Inclure les cookies ou autres identifiants
    })
    .then(response => {
        console.log("Response status:", response.status);  // Log du statut de la réponse
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(responseData => {
        console.log("Response data:", responseData);  // Log des données de la réponse
        alert("Registration successful! Please login.");
        const userId = responseData.userId; // ← Assure-toi que le backend renvoie bien `userId`
        if (userId) {
            localStorage.setItem(`basket_${userId}`, JSON.stringify([]));
            localStorage.setItem("userId", userId); // Stocker aussi l'userId pour l'utiliser plus tard
     }
        window.location.href = 'login.html'; // Redirection après inscription
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    });
}
