document.addEventListener("DOMContentLoaded", function () {
    const cartCountElement = document.getElementById("cart-count");
    const addToBasketButtons = document.querySelectorAll(".add-to-basket");

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

    // Appel initial
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

});

