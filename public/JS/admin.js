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
  