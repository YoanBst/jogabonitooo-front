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

 
// Afficher la liste des messages
fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/messages/all")
  .then(response => response.json())
  .then(data => {
    const messageList = document.getElementById("message-list");
    if (!messageList) return;

    data.messages.forEach(message => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message-item");
      messageElement.textContent = `${message.owner}: ${message.message}`;

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add("remove-btn");

      removeButton.addEventListener("click", () => {
        removeMessage(message.id, messageElement);
      });

      messageElement.appendChild(removeButton);
      messageList.appendChild(messageElement);
    });
  })
  .catch(error => {
    console.error("Erreur lors du fetch des messages:", error);
  });



// Fonction qui supprime un message
function removeMessage(messageId, messageElement) {
  fetch(`https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/messages/${messageId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Message deleted") {
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


// Récupère les ventes et affiche le camembert
fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/ventes-produits")
  .then(response => response.json())
  .then(data => {
    // Calcul du total des ventes
    const total = (data.ventes || []).reduce((sum, v) => sum + v.quantite, 0);
    const totalVentesDiv = document.getElementById('total-ventes');
    if (totalVentesDiv) {
      totalVentesDiv.textContent = `Total des ventes : ${total}`;
    }

    const ctx = document.getElementById('products-pie').getContext('2d');
    const noSalesMsg = document.getElementById('no-sales-msg');
    const topVentes = (data.ventes || []).slice(0, 4);

    if (!topVentes.length) {
      document.getElementById('products-pie').style.display = "none";
      noSalesMsg.style.display = "block";
      if (totalVentesDiv) totalVentesDiv.textContent = "";
      return;
    }

    const labels = topVentes.map(v => v.nom);
    const values = topVentes.map(v => v.quantite);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#009739', '#FFDF00', '#3E4095', '#FF6384', '#36A2EB', '#FFCE56'
          ],
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  })
  .catch(error => {
    console.error("Erreur lors du fetch des ventes produits:", error);
  });

  // Camembert des pays de livraison
fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/ventes-pays")
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('countries-pie').getContext('2d');
    const noCountryMsg = document.getElementById('no-country-msg');
    const topPays = (data.ventes || []).slice(0, 4);

    if (!topPays.length) {
      document.getElementById('countries-pie').style.display = "none";
      noCountryMsg.style.display = "block";
      return;
    }

    const labels = topPays.map(v => v.pays);
    const values = topPays.map(v => v.quantite);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#009739', '#FFDF00', '#3E4095', '#FF6384'
          ],
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  })
  .catch(error => {
    console.error("Erreur lors du fetch des pays clients:", error);
  });
  