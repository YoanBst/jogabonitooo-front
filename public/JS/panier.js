document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('.add-to-basket');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const userId = localStorage.getItem('userId');

            if (!userId) {
                alert("Vous devez être connecté pour ajouter des articles au panier !");
                return;
            }

            const basketKey = `basket_${userId}`;
            let basket = JSON.parse(localStorage.getItem(basketKey)) || [];

            const existingProduct = basket.find(item => item.name === name && item.price === price);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                basket.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            localStorage.setItem(basketKey, JSON.stringify(basket));
            alert("Product added to basket !");
        });
    });

    // NOUVEAU : Formatage automatique des champs de paiement
    // Formatage automatique du numéro de carte
    const cardInput = document.getElementById('card');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
        });
    }

    // Formatage de la date d'expiration
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

  
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const basketDiv = document.getElementById('basket');
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert("Vous devez être connecté pour voir votre panier !");
        return;
    }

    const basketKey = `basket_${userId}`;
    let basket = JSON.parse(localStorage.getItem(basketKey)) || [];

    const list = document.createElement('ul');
    let total = 0;

    basket.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} $ - Taille: ${item.size ? item.size : "Non spécifiée"} - Quantité: ${item.quantity}`;

        // Bouton pour retirer une quantité
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '15px';
        removeBtn.onclick = function() {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                basket.splice(index, 1);
            }
            localStorage.setItem(basketKey, JSON.stringify(basket));
            
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
        total += item.price * item.quantity;
    });

    basketDiv.appendChild(list);

    const totalP = document.createElement('p');
    totalP.innerHTML = `<strong>Total: ${total.toFixed(2)} $</strong>`;
    basketDiv.appendChild(totalP);
});

function clearBasket() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert("Vous devez être connecté pour vider votre panier !");
        return;
    }

    const basketKey = `basket_${userId}`;
    localStorage.removeItem(basketKey);
    localStorage.setItem("cartCount", 0); 

    const basketDiv = document.getElementById('basket');
    basketDiv.innerHTML = `<p><strong>Total: 0 $</strong></p>`;
}

function commander() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("Vous devez être connecté pour passer une commande !");
        return;
    }

    const basketKey = `basket_${userId}`;
    let basket = JSON.parse(localStorage.getItem(basketKey)) || [];

    if (basket.length === 0) {
        alert("Your basket is empty !");
        return;
    }

    const adressInput = document.getElementById('adress');
    const cardInput = document.getElementById('card');
    const countryInput = document.getElementById('country');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    const adress = adressInput.value;
    const card = cardInput.value.replace(/\s/g, ''); 
    const country = countryInput.value;
    const expiry = expiryInput.value;
    const cvv = cvvInput.value;

 
    if (!adress || !card || !country || !expiry || !cvv) {
        alert("Please fulfill all of the fields !");
        return;
    }

    if (card.length !== 16 || isNaN(card)) {
        alert("Your card number needs to be a 16-digit number !");
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert("Expiry date must be in MM/YY format!");
        return;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
        alert("CVV must be a 3-digit number!");
        return;
    }

    if (!isNaN(country)) {
        alert("Country must be only in letters!");
        return;
    }

    let total = 0;
    basket.forEach(item => {
        total += item.price * item.quantity;
    });

    const commande = {
        owner: userId,
        country: country,
        adress: adress,
        total: total,
        basket: basket
    };

    fetch('https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/commande', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commande)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if(country === "France") {
                alert("Thank you ! Your order will be delivered in 7 days !");
            }else{
                alert("Thank you ! Your order will be delivered in 14 days !");
            }

            clearBasket();
            adressInput.value = '';
            cardInput.value = '';
            countryInput.value = '';
            expiryInput.value = '';
            cvvInput.value = '';
            
        } else {
            alert("Erreur lors de la commande : " + data.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la commande');
    });
}


