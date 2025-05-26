// Fonction pour décoder le JWT et extraire les données
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);  // Retourne le contenu du token décodé
    } catch (err) {
        console.error("Erreur lors du décodage du token:", err);
        return null;
    }
}

// Fonction pour récupérer le nom d'utilisateur à partir du token
async function getCurrentUsername(authToken) {
    try {
        const decodedToken = decodeJWT(authToken);
        return decodedToken?.username || null; 
    } catch (error) {
        console.error("Erreur lors de la décodage du token:", error);
        return null;
    }
}

// Fonction pour afficher les messages reçus
async function displayMessage(owner, message, authToken) {
    const chatContainer = document.getElementById("messages");


    if (!chatContainer) {
        console.error("Erreur: chatContainer non trouvé");
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    
    const currentUser = await getCurrentUsername(authToken);

    
    if (!currentUser) {
        console.error("Utilisateur non trouvé dans le token");
        return;
    }

    // Affiche le message avec le nom d'utilisateur
    const userElement = document.createElement("span");
    userElement.textContent = `${owner}: `;
    userElement.classList.add("username");

    // Affiche le contenu du message 
    const messageText = document.createElement("span");
    messageText.textContent = message;

    
    messageElement.classList.add(owner === currentUser ? "my-message" : "other-message");

    messageElement.appendChild(userElement);
    messageElement.appendChild(messageText);

    chatContainer.appendChild(messageElement);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Fonction pour gérer le WebSocket et l'envoi de messages
function setupWebSocket(authToken) {
    const ws = new WebSocket("wss://jogabonitooo-back.cluster-ig3.igpolytech.fr/ws");

    ws.onopen = () => {
        console.log("✅ Connecté au WebSocket");
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.error) {
            console.error("Erreur:", data.error);
            if (data.error === "Unauthorized: Invalid token") {
                window.location.href = "login.html";
            }
            return;
        }

        displayMessage(data.owner, data.message, authToken);
    };

    ws.onclose = () => {
        console.log("❌ Déconnecté du WebSocket");
    };

    // Vérifier que les éléments existent avant d'ajouter les événements
    const sendButton = document.getElementById("send-button");
    const messageInput = document.getElementById("message-input");

    if (sendButton && messageInput) {
        sendButton.addEventListener("click", () => sendMessage(ws, authToken));
        messageInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                sendMessage(ws, authToken);
            }
        });
    }
}

// Fonction pour envoyer un message
function sendMessage(ws, authToken) {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (!authToken) {
        alert("Erreur: vous devez être connecté !");
        window.location.href = "login.html";
        return;
    }

    if (message.length === 0) {
        return;
    }

    if (message.length > 35) {
        alert("Message trop long (max: 35 caractères)");
        return;
    }

    // Envoi du message au WebSocket
    ws.send(JSON.stringify({ auth_token: authToken, message, color: "blue" }));
    messageInput.value = "";  // Réinitialise le champ de saisie
}

// Code pour récupérer le token et initier la connexion WebSocket
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const authToken = await getAuthToken();

        if (!authToken) {
            console.log("Redirection vers login.html (pas de token détecté)");
            window.location.href = "login.html";
        } else {
            console.log("Token détecté, connexion WebSocket en cours...");
            setupWebSocket(authToken); // Passer le token à setupWebSocket
        }
    } catch (error) {
        console.error("Erreur lors de l'authentification:", error);
        window.location.href = "login.html";
    }
});





function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const basketKey = `basket_${userId}`;
    const basket = JSON.parse(localStorage.getItem(basketKey)) || [];

    let totalQuantity = 0;
    basket.forEach(item => {
        totalQuantity += item.quantity;
    });

    cartCountElement.textContent = totalQuantity;
    cartCountElement.style.display = totalQuantity > 0 ? "inline-block" : "none";
}



window.addEventListener("DOMContentLoaded", updateCartCount);

document.addEventListener("DOMContentLoaded", async function () {
    

    
    try {
        const response = await fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/messages");
        const data = await response.json();
        if (data.messages) {
            const chatContainer = document.getElementById("messages");
            data.messages.forEach(msg => {
              
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");
                messageElement.textContent = `${msg.owner}: ${msg.message}`;
                chatContainer.appendChild(messageElement);
            });
        }
    } catch (err) {
        console.error("Erreur lors du chargement des messages :", err);
    }
});

