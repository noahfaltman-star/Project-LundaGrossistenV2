// =========================================================
// 1. DATABAS (Våra produkter)
// =========================================================
const products = [
	{
		id: 1,
		name: "Svensk Mellanmjölk",
		price: 15,
		category: "mejeri",
		desc: "Färsk mellanmjölk från svenska gårdar. 1.5% fetthalt.",
		image: "assets/mjolk.jpg",
	},
	{
		id: 2,
		name: "Herrgårdsost",
		price: 89,
		category: "mejeri",
		desc: "Mild och gräddig ost, lagrad i 12 månader.",
		image: "assets/ost.jpg",
	},
	{
		id: 3,
		name: "Oxfilé Premium",
		price: 299,
		category: "kott",
		desc: "Mörad oxfilé av högsta kvalitet. Perfekt till helgen.",
		image: "assets/oxfile.jpg",
	},
	{
		id: 4,
		name: "Chorizo",
		price: 45,
		category: "kott",
		desc: "Kryddig korv med hög kötthalt.",
		image: "assets/chorizo.jpg",
	},
	{
		id: 5,
		name: "Ekologiska Bananer",
		price: 25,
		category: "frukt",
		desc: "Rättvisemärkta bananer. Säljs i klase.",
		image: "assets/bananer.jpg",
	},
	{
		id: 6,
		name: "Avocado",
		price: 15,
		category: "gront",
		desc: "Mogen ätklar avocado.",
		image: "assets/avocado.jpg",
	},
];

// Mappar filnamnet till det interna kategorinamnet i 'products' aryan.
const CATEGORY_MAPPING = {
	home: "all",
	mejeri: "mejeri",
	kott: "kott",
	frukt: "frukt",
	gront: "gront",
};

// =========================================================
// 2. TILLSTÅND (State) & REFERENSER TILL HTML
// =========================================================
let cart = [];
const productContainer = document.getElementById("product-container");
const cartCounter = document.getElementById("cart-counter");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const cartModal = document.getElementById("cart-modal");
const productModal = document.getElementById("product-modal");

// =========================================================
// 3. ÅTERANVÄNDBARA FUNKTIONER (Cart Logic)
// =========================================================

function closeModal(modalId) {
	document.getElementById(modalId).classList.add("hidden");
}
function toggleMenu() {
	const nav = document.getElementById("category-nav");
	nav.classList.toggle("open");
}

// Lägg till vara
function addToCart(productId, event) {
	if (event) event.stopPropagation();
	const productToAdd = products.find(p => p.id === productId);
	const existingItem = cart.find(item => item.id === productId);
	if (existingItem) {
		existingItem.quantity++;
	} else {
		cart.push({ ...productToAdd, quantity: 1 });
	}
	updateCartUI();
	renderCartList();
}

// Ta bort vara
function removeFromCart(productId) {
	cart = cart.filter(item => item.id !== productId);
	renderCartList();
	updateCartUI();
}

function updateCartUI() {
	let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
	if (cartCounter) cartCounter.innerText = totalItems;
}

// Rita ut listan inuti varukorgs-modal
function renderCartList() {
	cartItemsContainer.innerHTML = "";
	let totalCost = 0;

	if (cart.length === 0) {
		cartItemsContainer.innerHTML = "<p>Varukorgen är tom.</p>";
	} else {
		cart.forEach(item => {
			const itemTotal = item.price * item.quantity;
			totalCost += itemTotal;

			const row = document.createElement("div");
			row.style.borderBottom = "1px solid #eee";
			row.style.padding = "10px 0";
			row.style.display = "flex";
			row.style.justifyContent = "space-between";
			row.style.alignItems = "center";

			row.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    ${item.quantity} st x ${item.price} kr
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span>${itemTotal.toFixed(2)} kr</span>
                    <button onclick="removeFromCart(${
					item.id
				})" class="buy-btn" style="background:#ff4444; padding:5px 10px; width:auto; font-size:0.8rem;">Ta bort</button>
                </div>
            `;
			cartItemsContainer.appendChild(row);
		});
	}

	totalPriceEl.innerText = totalCost.toFixed(2);
}

function openCartModal() {
	renderCartList();
	if (cartModal) cartModal.classList.remove("hidden");
}

// =========================================================
// 4. RENDERING & SIDHANTERING (ENKEL PRODUKTLISTA)
// =========================================================

/**
 * Ritar ut produkterna i en enkel textlista
 */
function renderProducts(productList) {
	if (!productContainer) return;

	productContainer.innerHTML = "";

	// Skapa en ny wrapper för den enkla listan
	const productListWrapper = document.createElement("div");
	productListWrapper.id = "simple-product-list";

	productList.forEach(product => {
		const card = document.createElement("div");
		card.classList.add("simple-product-card");

		// ENKEL HTML-struktur: Namn | Pris | Lägg till-knapp
		card.innerHTML = `
            <span class="simple-name">${product.name}</span>
            <span class="simple-price">${product.price} kr</span>
            <button class="simple-add-btn" onclick="addToCart(${product.id}, event)">
                Lägg till
            </button>
        `;

		productListWrapper.appendChild(card);
	});

	productContainer.appendChild(productListWrapper);
}

/**
 * Bestämmer vilken kategori som ska visas baserat på filnamnet (t.ex. kott.html)
 */
function loadPageProducts() {
	const path = window.location.pathname.split("/").pop();
	let categoryKey = "home";

	if (path !== "home.html" && path !== "") {
		categoryKey = path.split(".")[0];
	}

	const categoryToFilter = CATEGORY_MAPPING[categoryKey] || "all";

	let productsToRender = products;

	if (categoryToFilter !== "all") {
		productsToRender = products.filter(
			p => p.category === categoryToFilter
		);
	}

	renderProducts(productsToRender);
}

// =========================================================
// 5. START UP LOGIC
// =========================================================

// FEJKPRODUKT FUNKTION (Läggs till för test)
function loadInitialCart() {
	const productToFake = products.find(p => p.id === 1);
	if (productToFake) {
		cart.push({ ...productToFake, quantity: 2 });
	}
}

// Stäng modal om man klickar på den mörka bakgrunden (overlay)
window.onclick = function (event) {
	if (
		event.target.classList &&
		event.target.classList.contains("modal-overlay")
	) {
		event.target.classList.add("hidden");
	}
};

// Starta applikationen vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
	loadInitialCart();
	loadPageProducts(); // Rendera produkter baserat på filnamnet
	updateCartUI();
});
