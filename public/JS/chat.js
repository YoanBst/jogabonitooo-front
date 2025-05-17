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
        return decodedToken?.username || null; // Si le nom d'utilisateur est trouvé, retourne-le
    } catch (error) {
        console.error("Erreur lors de la décodage du token:", error);
        return null;
    }
}

// Fonction pour afficher les messages reçus
async function displayMessage(owner, message, authToken) {
    const chatContainer = document.getElementById("messages");

    // Vérifie si chatContainer existe avant d'y ajouter des messages
    if (!chatContainer) {
        console.error("Erreur: chatContainer non trouvé");
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Récupère le nom d'utilisateur actuel depuis le token
    const currentUser = await getCurrentUsername(authToken);

    // Si le nom de l'utilisateur est trouvé dans le token
    if (!currentUser) {
        console.error("Utilisateur non trouvé dans le token");
        return;
    }

    // Affiche le message avec le nom d'utilisateur
    const userElement = document.createElement("span");
    userElement.textContent = `${owner}: `;
    userElement.classList.add("username");

    // Affiche le contenu du message (ce qui a été réellement écrit par l'utilisateur)
    const messageText = document.createElement("span");
    messageText.textContent = message;

    // Classe du message pour différencier entre les messages de l'utilisateur actuel et des autres
    messageElement.classList.add(owner === currentUser ? "my-message" : "other-message");

    // Ajout du nom d'utilisateur et du message à la boîte de conversation
    messageElement.appendChild(userElement);
    messageElement.appendChild(messageText);

    chatContainer.appendChild(messageElement);

    // Auto scroll au dernier message
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

        // Appel à displayMessage en passant le nom d'utilisateur et le message
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

// Fonction pour récupérer le token JWT dans les cookies
async function getAuthToken() {
    try {
        const response = await fetch(" https://jogabonitooo-back.cluster-ig3.igpolytech.fr:8080/get-token", {
            method: 'GET',
            credentials: 'include',  // Assure-toi d'inclure les cookies
        });

        const data = await response.json();
        console.log("Token récupéré:", data.auth_token);

        if (data.auth_token) {
            return data.auth_token;  // Retourne le token si trouvé
        } else {
            console.error("Le token est vide ou absent");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du token:", error);
        return null;
    }
}




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


// Appelle cette fonction au chargement de la page
window.addEventListener("DOMContentLoaded", updateCartCount);

document.addEventListener("DOMContentLoaded", async function () {
    

    // Récupère 4 anciens messages aléatoires
    try {
        const response = await fetch(" https://jogabonitooo-back.cluster-ig3.igpolytech.fr:8080/api/messages");
        const data = await response.json();
        if (data.messages) {
            const chatContainer = document.getElementById("messages");
            data.messages.forEach(msg => {
                // Utilise ta fonction d'affichage existante
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

