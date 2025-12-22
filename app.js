//================
// DATA & MODELLERT
// ===============
/**
 * Klass som representerar en produkt i shoppen
 * används för att skapa produktobjekt och generera HTML-kort
 */
class Product {
  constructor(id, name, price, category, desc, image) {
    Object.assign(this, { id, name, price, category, desc, image });
  }
  /**
   * 
   * Skapar och returnerar ett produktkort (HTML-element)
   */
  createCard() {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="card-image-container">
        <img src="${this.image}" alt="${this.name}">
      </div>
      <div class="card-content">
        <h3 class="card-title">${this.name}</h3>
        <div class="card-price">${this.price} kr</div>
        <div class="card-footer">
          <button class="card-minus-btn" onclick="changeQty(${this.id}, -1)">−</button>
          <span class="card-qty" id="qty-${this.id}">0 st</span>
          <button class="card-plus-btn" onclick="changeQty(${this.id}, 1)">+</button>
          <button class="add-btn" onclick="addToCartFromCard(${this.id})"><i class="fa-solid fa-cart-plus"></i></button>
        </div>
      </div>
    `;
    // klick på kortet(men inte knappar) öppnar produkt-modal
    card.addEventListener("click", (e) => !e.target.closest('button') && openProductModal(this));
    return card;
  }
}
// Lista med alla produkter i webbshoppen

const products = [
  new Product(1, "Mjölk 1L", 15, "mejeri", "Färsk svensk mjölk.", "assets/mjolk.jpg"),
  new Product(2, "Smör", 55, "mejeri", "Normalsaltat smör.", "assets/smor.jpg"),
  new Product(3, "Oxfilé", 299, "kott", "Mör oxfilé.", "assets/oxfile.jpg"),
  new Product(4, "Kycklingfilé", 120, "kott", "Fryst kyckling.", "assets/kyckling.avif"),
  new Product(5, "Bananer", 25, "frukt", "Ekologiska bananer.", "assets/bananer.jpg"),
  new Product(6, "Äpplen", 29, "frukt", "Svenska äpplen.", "assets/apple.webp"),
  new Product(7, "Avocado", 15, "gront", "Mogen avocado.", "assets/avocado.jpg"),
  new Product(8, "Gurka", 12, "gront", "Svensk gurka.", "assets/gurka.webp"),
];

// Global state

let cart = [];
let productQtys = {};
let currentProduct = null;
let modalQty = 0;

// INITiIERING
/**
 * Körs när sidan laddas
 * Initierar kvantiteter och laddar produkter
 */

const init = () => {
  products.forEach(p => productQtys[p.id] = 0);
  loadProducts();
};

// KVANTITETSHANTERING

//* Ökar eller minskar kvantitet på produkrkort

const changeQty = (id, amount) => {
  productQtys[id] = Math.max(0, productQtys[id] + amount);
  document.getElementById(`qty-${id}`).textContent = `${productQtys[id]} st`;
};
//============
// VARUKORG
//=============

//* Lägger vald kvantiet feån produktkort till varukorgen

const addToCartFromCard = (id) => {
  const qty = productQtys[id];
  if (qty > 0) {
    addToCart(id, qty);
    productQtys[id] = 0;
    document.getElementById(`qty-${id}`).textContent = "0 st";
  } else {
    showNotification("Välj antal först!", "error");
  }
};
/**
 * Lägger till produkt i varukorgen
 */
const addToCart = (id, qty = 1) => {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  // om produkten redan finns, äka antal

  item ? item.qty += qty : cart.push({ ...product, qty });
  updateCartCounter();
  showNotification(`${product.name} tillagd!`);
};
/** 
 * tar bort produkt helt från varukorgen
*/
const removeFromCart = (id) => {
  const product = cart.find(item => item.id === id);
  cart = cart.filter(item => item.id !== id);
  updateCartCounter();
  renderCart();
  showNotification(`${product.name} borttagen!`);
};
/** 
 * uppdaterar räknaren på varukorgsikonen
*/

const updateCartCounter = () => {
  document.getElementById("cart-counter").textContent = cart.reduce((sum, i) => sum + i.qty, 0);
};
//=============
// MODALS
//================
/**
 * öppnar varukorgmodal
 */
const openCartModal = () => {
  renderCart();
  document.getElementById("cart-modal").classList.remove("hidden");
};

/**
 * Stänger valfri modal via id
 */

const closeModal = (id) => {
  document.getElementById(id).classList.add("hidden");
};
/**
 * Renderar innehållet i varukorgen
 */

const renderCart = () => {
  const container = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  
  if (cart.length === 0) {
    container.innerHTML = "<p>Varukorgen är tom.</p>";
    totalPrice.textContent = "0.00";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong><br>
        <span class="cart-item-details">${item.qty} st × ${item.price} kr = ${(item.price * item.qty).toFixed(2)} kr</span>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');

  totalPrice.textContent = cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);
};

/**
 * Öppnar produkt-modal med detaljer
 */

const openProductModal = (product) => {
  currentProduct = product;
  modalQty = 0;
  
  const modalImg = document.getElementById("modal-img");
  modalImg.src = product.image;
  
  document.getElementById("modal-title").textContent = product.name;
  document.getElementById("modal-desc").textContent = product.desc;
  document.getElementById("modal-price").textContent = product.price + " kr";
  document.getElementById("modal-qty").textContent = "0 st";

  document.getElementById("product-modal").classList.remove("hidden");
};
/**
 * Stänger produkt-modal
 */

const closeProductModal = () => {
  document.getElementById("product-modal").classList.add("hidden");
};
/**
 * Ändrar antal i produkt-modal
 */

const changeModalQty = (amount) => {
  modalQty = Math.max(0, modalQty + amount);
  document.getElementById("modal-qty").textContent = modalQty + " st";
};
/**
 * Lägger vald produkt från modal till varukorgen
 */
const addModalToCart = () => {
  if (modalQty > 0) {
    addToCart(currentProduct.id, modalQty);
    closeProductModal();
  }
};

// =========================
// NOTIFIERINGAR
// ========================
/**
 * Visar en tillfällig notifiering
 */
const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.closest('.notification').remove()">
      <i class="fa-solid fa-times"></i>
    </button>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => notification.remove(), 3000);
};

// =========================
// PRODUKTLADDNING & MENY
// =========================
/**
 * Laddar produkter baserat på vald kategori
 */
const loadProducts = () => {
  const category = document.body.dataset.category || "all";
  const container = document.getElementById("product-container");
  const list = category === "all" ? products : products.filter(p => p.category === category);
  
  container.innerHTML = "";
  list.forEach(p => container.appendChild(p.createCard()));
};
/**
 * Öppnar/stänger mobilmeny
 */

const toggleMenu = () => {
  document.getElementById("category-nav").classList.toggle("open");
};
//=============
// STARTPUNKT
//================
document.addEventListener("DOMContentLoaded", init);