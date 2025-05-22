document.addEventListener("DOMContentLoaded", function () {
    fetch(" https://jogabonitooo-back.cluster-ig3.igpolytech.fr/users")
      .then(response => response.json())
      .then(data => {
        const userList = document.getElementById("user-list"); // L'élément où on affiche les utilisateurs
  
        if (!userList) return;
  
        data.users.forEach(user => {
          const userElement = document.createElement("div");
          userElement.classList.add("user-item");
          userElement.textContent = `ID: ${user.id} | Username: ${user.username}`;
  
          // Créer un bouton Remove pour chaque utilisateur
          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.classList.add("remove-btn");
  
          // Ajouter l'action du bouton pour supprimer l'utilisateur
          removeButton.addEventListener("click", () => {
            removeUser(user.id, userElement);
          });
  
          // Ajouter le bouton à l'élément utilisateur
          userElement.appendChild(removeButton);
          userList.appendChild(userElement);
        });
      })
      .catch(error => {
        console.error("Erreur lors du fetch des utilisateurs:", error);
      });
  });
  
  // Fonction qui supprime un utilisateur
  function removeUser(userId, userElement) {
    fetch(`https://jogabonitooo-back.cluster-ig3.igpolytech.fr/users/${userId}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "User deleted") {
          // Supprimer l'élément de l'interface
          userElement.remove();
            alert("User deleted successfully");
            
        } else {
          alert("Error deleting user");
        }
      })
      .catch(error => {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      });
  }

document.addEventListener("DOMContentLoaded", function () {
  

  // Afficher les messages
  fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/messages")
    .then(response => response.json())
    .then(data => {
      const messageList = document.getElementById("message-list"); // L'élément où on affiche les messages

      if (!messageList) return;

      data.messages.forEach(msg => {
        const msgElement = document.createElement("div");
        msgElement.classList.add("message-item");
        msgElement.textContent = `ID: ${msg.id} | ${msg.owner}: ${msg.message}`;

        // Créer un bouton Remove pour chaque message
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");

        // Action du bouton pour supprimer le message
        removeBtn.addEventListener("click", () => {
          removeMessage(msg.id, msgElement);
        });

        msgElement.appendChild(removeBtn);
        messageList.appendChild(msgElement);
      });
    })
    .catch(error => {
      console.error("Erreur lors du fetch des messages:", error);
    });
});

  // Fonction qui supprime un message
function removeMessage(messageId, messageElement) {
  fetch(`https://jogabonitooo-back.cluster-ig3.igpolytech.fr/messages/${messageId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Message deleted") {
        // Supprimer l'élément de l'interface
        messageElement.remove();
        alert("Message deleted successfully");
      } else {
        alert("Error deleting message");
      }
    })
    .catch(error => {
      console.error("Error deleting message:", error);
      alert("Error deleting message");
    });
}





  