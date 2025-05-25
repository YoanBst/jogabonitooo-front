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
                const name = fav.product_name.toLowerCase();
                if (name.includes("kostas mitroglou")) imgSrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJbD3zmDlmhH0c2U6DxJagrWJcVu1J0b4BSg&s";
                else if (name.includes("erlin braut haaland")) imgSrc = "https://i.ebayimg.com/images/g/488AAOSwX51kggjh/s-l1200.jpg";
                else if (name.includes("fabian ruiz")) imgSrc = "https://www.aisope.fr/images/PZQW/WSDDH2690.jpg";
                else if (name.includes("anthony")) imgSrc = "https://images.footballfanatics.com/manchester-united/manchester-united-adidas-adidas-home-shirt-2024-25-with-antony-21-printing_ss5_p-201712399+pv-3+u-ergf39zxad02mwkvxp11+v-cdiwftiv3tmyxogzmzsz.jpg?_hv=2&w=900alt=";
                else if (name.includes("alexandre lacazette")) imgSrc = "https://thumblr.uniid.it/product/194446/dfb3d8593cc0.jpg?width=3840&format=webp&q=75";
                else if (name.includes("islam slimani")) imgSrc = "https://www.aisope.fr/images/MZQC/CBVK3996.jpg";
                else if (name.includes("mariano diaz")) imgSrc = "https://www.aisope.fr/images/JZQM/SAAT1816.jpg";
                else if (name.includes("neymar jr")) imgSrc = "https://soccerzoneusa.com/cdn/shop/files/preview_f1d1e787-5ee4-4e9a-9b3e-3fe41ace3fc8.webp?v=1716304460";
                else if (name.includes("viktor gyökeres")) imgSrc = "https://www.aisope.fr/images/QZQM/SEEH3200.jpg";
                else if (name.includes("jordan veretout")) imgSrc = "https://www.aisope.fr/images/UZQK/KSDDH2123.jpg";
                else if (name.includes("phil coutinho")) imgSrc = "https://www.sportingplus.net/3661-large_default/maillot-de-foot-fc-liverpool-domicile-201415-coutinho-10-warrior.jpg";
                else if (name.includes("olivier giroud")) imgSrc = "https://foot-star.com/wp-content/uploads/2022/11/MAILLOT-EQUIPE-DE-FRANCE-DOMICILE-COUPE-DU-MONDE-2022-GIROUD-2.jpg";

                else if (name.includes("stephen curry")) imgSrc = "https://www.bshopbasketball.fr/77819-large_default/maillot-nba-enfant-stephen-curry-golden-state-warriors-nike-icon-edition.jpg";
                else if (name.includes("thanasis antetokounmpo")) imgSrc = "https://images.footballfanatics.com/milwaukee-bucks/milwaukee-bucks-nike-icon-edition-swingman-jersey-hunter-green-giannis-antetokounmpo-unisex_ss4_p-13349398+pv-2+u-f7s1p5esdr45cc71ei2w+v-dfc053bdff5c4933872ee9ff65ba6135.jpg?_hv=2&w=600";
                else if (name.includes("russel westbrook")) imgSrc = "https://images.footballfanatics.com/los-angeles-lakers/youth-nike-russell-westbrook-gold-los-angeles-lakers-2021/22-swingman-jersey-icon-edition_pi4447000_altimages_ff_4447200-644311fb9493e0683754alt3_full.jpg?_hv=2&w=600";
                else if (name.includes("allen iverson")) imgSrc = "https://cdn2.basket4ballers.com/54371-thickbox_default/maillot-nba-allen-iverson-philadelphia-76ers-2000-01-swingman-mitchellness.jpg";
                else if (name.includes("michael jordan")) imgSrc = "https://cdn1.basket4ballers.com/83460-thickbox_default/maillot-nba-michael-jordan-chicago-bulls-95-authentic-mitchellness-road.jpg";
                else if (name.includes("killian hayes")) imgSrc = "https://baskettemple.com/wp-content/uploads/2022/11/detroit-pistons-nike-icon-edition-swingman-jersey-blue-killian-hayes-unisex_ss4_p-13348366pv-2u-14djlhz1zxsafev3n3vjv-624ef0e62183439bbe405503551c4eef.jpg";
                else if (name.includes("magic johnson")) imgSrc = "https://ansel.frgimages.com/signed-magic-johnson-jersey-1984-85-mn-hwc-swingman-yellow-bas-wit_ss2_p-12412689+pv-1+u-12rsn9jdz52t8q7hcwn8+v-yhhnzjjosxudtezmdows.jpg?_hv=2&w=900";
                else if (name.includes("larry bird")) imgSrc = "https://cdn2.basket4ballers.com/54368-thickbox_default/swingman-jersey-larry-bird-33-green-white-353j-301-fgylbi.jpg";
                else if (name.includes("lamelo ball")) imgSrc = "https://cdn1.basket4ballers.com/198555-thickbox_default/maillot-nba-lamelo-ball-charlotte-hornets-nike-association-edition-2023-dn2071-100.jpg";
                else if (name.includes("james harden")) imgSrc = "https://images.footballfanatics.com/houston-rockets/houston-rockets-nike-icon-swingman-jersey-james-harden-mens_ss4_p-11890925+pv-1+u-9o4i6qy4g04pmyb32y40+v-7b6cbb41b138482d8799229e6c09e392.jpg?_hv=2&w=900";
                else if (name.includes("muggsy bogues")) imgSrc = "https://images.footballfanatics.com/charlotte-hornets/mens-mitchell-and-ness-muggsy-bogues-teal-charlotte-hornets-hardwood-classics-swingman-jersey_pi2751000_altimages_ff_2751345alt3_full.jpg?_hv=2&w=900";
                else if (name.includes("derrick rose")) imgSrc = "https://www.fashionrerun.com/cdn/shop/files/b999b4a248529ae24a15ac3507cbdf86.jpg?v=1725711099&width=1080";

                else if (name.includes("marc marquez") && name.includes("shirt")) imgSrc = "https://medias.la-becanerie.com/cache/images_articles/b/3840_2160/t-shirt-enfant-marc-marquez-kid-rouge.jpg";
                else if (name.includes("valentino rossi") && name.includes("jacket")) imgSrc = "https://i.ebayimg.com/images/g/pPwAAOSwuU9c-eM-/s-l1200.jpg";
                else if (name.includes("valentino rossi") && name.includes("helmet")) imgSrc = "https://www.miniatures-minichamps.com/80248-thickbox_default/casque-helmet-agv-1-8-valentino-rossi-moto-gp-2021-minichamps-399210046.jpg";
                else if (name.includes("marc marquez") && name.includes("helmet")) imgSrc = "https://www.gpracingapparels.com/media/catalog/product/cache/2070c28d26a34521047ff7229c4576d8/9/9/9999221620320_1.jpg";
                else if (name.includes("jorge lorenzo") && name.includes("flag")) imgSrc = "https://m.media-amazon.com/images/I/51kiPggE6zL._UF1000,1000_QL80_.jpg";
                else if (name.includes("fabio quartararo")) imgSrc = "https://www.sasiecenter.com/136613-large_default/t-shirt-fabio-quartararo-noirrouge.jpg";
                else if (name.includes("casey stoner")) imgSrc = "https://i.etsystatic.com/22817528/r/il/2b0b02/5643584540/il_570xN.5643584540_1g85.jpg";
                else if (name.includes("marc marquez") && name.includes("miniature")) imgSrc = "https://m.media-amazon.com/images/I/81yFv6WKMRL.jpg";
                else if (name.includes("cap ducati")) imgSrc = "https://www.esprit-ducat.com/media/catalog/product/cache/bfae07b7090e672a4a40d78a126763bf/h/j/hjthjjkbnbvn.webp";
                else if (name.includes("johann zarco")) imgSrc = "https://www.planet-racing.fr/29240-large_default/t-shirt-homme-noir.jpg";
                else if (name.includes("pramac")) imgSrc = "https://www.dafy-moto.com/images/product/high/t-shirt-ixon-pramac-23-rouge-blanc-violet-1.jpg";
                else if (name.includes("jacket ducati")) imgSrc = "https://www.esprit-ducat.com/media/catalog/product/cache/bfae07b7090e672a4a40d78a126763bf/1/a/1aa6c4aa7c60af54772c17a54f551331.webp";

                        
            favorisList.innerHTML += `
                <div class="favori-card">
                    <img src="${imgSrc}" alt="${fav.product_name}">
                    <div><b>${fav.product_name}</b></div>
                    <div>Price : ${fav.price} $</div>
                   <button class="favorite-btn" title="Retirer des favoris" onclick="removeFavori('${fav.product_name.replace(/'/g,"\\'")}')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            `;

            });
        } else {
            favorisList.innerHTML = "<span>No favorites available.</span>";
        }
    } catch (e) {
        favorisList.innerHTML = "<span>Error during the loading of the favorites</span>";
    }
}

// Supprimer un favori
async function removeFavori(productName) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    await fetch("https://jogabonitooo-back.cluster-ig3.igpolytech.fr/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productName })
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
                // Formatage de la date
                let dateAffichee = "?";
                if (cmd.date) {
                    const d = new Date(cmd.date);
                    dateAffichee = d.toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
                commandesList.innerHTML += `
                    <div class="commande-card">
                        <div><b>Date :</b> ${dateAffichee}</div>
                        <div><b>Total :</b> ${cmd.total} $</div>
                        <div><b>Adresse :</b> ${cmd.adress || "-"}</div>
                        <div><b>Articles :</b> ${itemsHtml || "Non disponible"}</div>
                    </div>
                `;
            });
        } else {
            commandesList.innerHTML = "<span>No command find.</span>";
        }
    } catch (e) {
        commandesList.innerHTML = "<span>Error durring the loading of the command</span>";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadFavoris();
    loadCommandes();
});