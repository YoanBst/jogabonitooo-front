document.addEventListener("DOMContentLoaded", function () {
    const cartCountElement = document.getElementById("cart-count");
    const addToBasketButtons = document.querySelectorAll(".add-to-basket");
    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    function updateCartCount() {
        const userId = localStorage.getItem("userId");
        if (!userId || !cartCountElement) return;

        const basketKey = `basket_${userId}`;
        const basket = JSON.parse(localStorage.getItem(basketKey)) || [];

        let count = 0;
        basket.forEach(item => {
            count += item.quantity;
        });

        if (count === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.textContent = count;
            cartCountElement.style.display = 'inline-block';
        }
    }

    
    updateCartCount();

    addToBasketButtons.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            const userId = localStorage.getItem("userId");

            // Vérifie si la taille est requise pour ce produit
            const requireSize = button.getAttribute("data-require-size") !== "false";

            const productInfo = button.closest('.product-info');
            const sizeSelect = productInfo.querySelector('.product-size');
            const size = sizeSelect ? sizeSelect.value : "";

            if (requireSize && !size) {
                alert("You need to choose a size!");
                return;
            }

            if (!userId) {
                alert("Vous devez être connecté pour ajouter au panier !");
                return;
            }

            const basketKey = `basket_${userId}`;
            let basket = JSON.parse(localStorage.getItem(basketKey)) || [];

            // Chercher un article avec même nom, prix et taille (ou sans taille)
            const existingItem = basket.find(item =>
                item.name === name &&
                item.price === price &&
                (item.size || "") === (size || "")
            );
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                basket.push({ name, price, size: size || null, quantity: 1 });
            }

            localStorage.setItem(basketKey, JSON.stringify(basket));
            updateCartCount();
            console.log("✅ Produit ajouté au panier :", name, "Taille :", size);
        });
    });

    
    favoriteButtons.forEach(button => {
        button.addEventListener("click", () => toggleFavorite(button));
    });

    // Charger l'état des favoris au chargement
    loadFavoritesState();

    
   async function toggleFavorite(button) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Vous devez être connecté pour ajouter aux favoris!");
        return;
    }

    const productName = button.getAttribute("data-product");
    const price = parseFloat(button.getAttribute("data-price"));
    const productInfo = button.closest('.product-info');
    const sizeSelect = productInfo.querySelector('.product-size');
    const size = sizeSelect ? sizeSelect.value : "";

    const isActive = button.classList.contains('active');

    try {
        if (isActive) {
            // SUPPRESSION du favori
            const body = { userId, productName};

            const response = await fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/favorites", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                button.classList.remove('active');
                console.log("❌ Retiré des favoris:", productName);
            }
        } else {
            // AJOUT du favori
            const body = { userId, productName, price };

            const response = await fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                button.classList.add('active');
                console.log("❤️ Ajouté aux favoris:", productName);
            }
        }
    } catch (error) {
        console.error("Erreur favoris:", error);
        alert("Erreur lors de la modification des favoris");
    }
}

    // Charger l'état des favoris depuis le serveur
    async function loadFavoritesState() {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            const response = await fetch(`https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/favorites/${userId}`);
            const data = await response.json();
            
            if (data.favorites) {
                data.favorites.forEach(fav => {
                    // Trouver le bouton correspondant
                    const btn = Array.from(favoriteButtons).find(button => {
                        return button.getAttribute('data-product') === fav.product_name && 
                               (button.closest('.product-info').querySelector('.product-size')?.value || '') === (fav.size || '');
                    });
                    
                    if (btn) {
                        btn.classList.add('active');
                    }
                });
            }
        } catch (error) {
            console.error("Erreur chargement favoris:", error);
        }
    }
});