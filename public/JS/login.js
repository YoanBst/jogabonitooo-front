function login() {
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
  
    const data = { username: login, password: password };
  
    fetch('httpS://jogabonitooo-back.cluster-ig3.igpolytech.fr:8080/login', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response from server:", data);
  
      if (data.message === "Login successful") {
        console.log("Received userId:", data.userId, "role:", data.role);
  
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
  
        if (data.role === "admin") {
          window.location.href = '../HTML/admin.html';
        } else {
          window.location.href = '../HTML/page_accueil.html';
        }
      } else {
        throw new Error('Invalid username or password');
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
      alert('Error: ' + error.message);
    });
  }
  

// Pour la page d'accueil : vérifie si l'utilisateur est connecté
window.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("page_accueil.html")) {
      fetch('httpS://jogabonitooo-back.cluster-ig3.igpolytech.fr:8080/me', {
        method: 'GET',
        credentials: 'include'  // Inclut les cookies avec la requête
      })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        console.log("Utilisateur connecté :", data);
  
        // Affichage du nom de l'utilisateur dans l'en-tête de la page
        const header = document.querySelector("header");
        const p = document.createElement("p");
        p.textContent = `Bienvenue, ${data.username} !`;
        p.style.color = "white";
        p.style.marginLeft = "20px";
        header.appendChild(p);
      })
      .catch(error => {
        console.warn("Utilisateur non connecté, redirection...");
        window.location.href = "../HTML/login.html"; // Redirection vers la page de connexion
      });
    }
  });
  