function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const basketKey = `basket_${userId}`;
    const basket = JSON.parse(localStorage.getItem(basketKey)) || [];
    let totalQuantity = 0;
    basket.forEach(item => { totalQuantity += item.quantity; });
    cartCountElement.textContent = totalQuantity;
    cartCountElement.style.display = totalQuantity > 0 ? "inline-block" : "none";
}
window.addEventListener("DOMContentLoaded", updateCartCount);

// Récupère et affiche les favoris
async function loadFavoris() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const favorisList = document.getElementById("favoris-list");
    favorisList.innerHTML = "<span>Chargement...</span>";
    try {
        const response = await fetch(`https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/favorites/${userId}`);
        const data = await response.json();
        favorisList.innerHTML = "";
        if (data.favorites && data.favorites.length > 0) {
            data.favorites.forEach(fav => {
                
                let imgSrc = "https://via.placeholder.com/200x120?text=Produit";
                if (fav.product_name.toLowerCase().includes("marc marquez")) imgSrc = "https://medias.la-becanerie.com/cache/images_articles/b/3840_2160/t-shirt-enfant-marc-marquez-kid-rouge.jpg";
                if (fav.product_name.toLowerCase().includes("valentino rossi")) imgSrc = "https://i.ebayimg.com/images/g/pPwAAOSwuU9c-eM-/s-l1200.jpg";
                if (fav.product_name.toLowerCase().includes("curry")) imgSrc = "https://www.bshopbasketball.fr/77819-large_default/maillot-nba-enfant-stephen-curry-golden-state-warriors-nike-icon-edition.jpg";
                

                        
            favorisList.innerHTML += `
                <div class="favori-card">
                    <img src="${imgSrc}" alt="${fav.product_name}">
                    <div><b>${fav.product_name}</b></div>
                    <div>Prix : ${fav.price} $</div>
                    <button class="favorite-btn" title="Retirer des favoris" onclick="removeFavori('${fav.product_name.replace(/'/g,"\\'")}', '${fav.size || ""}')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            `;

            });
        } else {
            favorisList.innerHTML = "<span>Aucun favori pour l'instant.</span>";
        }
    } catch (e) {
        favorisList.innerHTML = "<span>Erreur lors du chargement des favoris.</span>";
    }
}

// Supprimer un favori
async function removeFavori(productName, size) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    await fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productName, size })
    });
    loadFavoris();
}

// Récupère et affiche l'historique des commandes
async function loadCommandes() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const commandesList = document.getElementById("commandes-list");
    commandesList.innerHTML = "<span>Chargement...</span>";
    try {
        const response = await fetch(`https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/commandes/user/${userId}`);
        const data = await response.json();
        commandesList.innerHTML = "";
        if (data.commandes && data.commandes.length > 0) {
            data.commandes.forEach(cmd => {
                let itemsHtml = "";
                if (cmd.items && cmd.items.length > 0) {
                    itemsHtml = '<ul class="commande-items">';
                    cmd.items.forEach(item => {
                        itemsHtml += `<li>${item.product_name} (${item.size || "-"}) x${item.quantity} - ${item.price} $</li>`;
                    });
                    itemsHtml += '</ul>';
                }
                commandesList.innerHTML += `
                    <div class="commande-card">
                        <div><b>Date :</b> ${cmd.date || "?"}</div>
                        <div><b>Total :</b> ${cmd.total} $</div>
                        <div><b>Adresse :</b> ${cmd.adress || "-"}</div>
                        <div><b>Articles :</b> ${itemsHtml || "Non disponible"}</div>
                    </div>
                `;
            });
        } else {
            commandesList.innerHTML = "<span>Aucune commande trouvée.</span>";
        }
    } catch (e) {
        commandesList.innerHTML = "<span>Erreur lors du chargement des commandes.</span>";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadFavoris();
    loadCommandes();
});