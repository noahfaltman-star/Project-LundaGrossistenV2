/* =========================================
   VG-NIVÅ: OBJEKTORIENTERAD PROGRAMMERING
   ========================================= */

/* --- 1. KLASS: PRODUCT ---
   Ansvar: Hålla data om en vara och generera sin egen HTML. */
class Product {
  constructor(id, name, price, category, desc, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.desc = desc;
    this.image = image;
  }

  // Metod för att skapa HTML-kortet för produkten
  createCardHTML() {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
            <img src="${this.image}" alt="${this.name}">
            <h3>${this.name}</h3>
            <p>${this.price} kr</p>
            <button class="buy-btn" data-id="${this.id}">Köp</button>
        `;

    // Lyssna på klick på själva kortet (för detalj-modal)
    card.addEventListener("click", (e) => {
      // Om vi INTE klickade på köp-knappen, öppna modalen
      if (!e.target.classList.contains("buy-btn")) {
        // Vi använder en global funktion eller event för att öppna modalen (för enkelhetens skull)
        app.ui.openProductModal(this);
      }
    });

    // Lyssna på köp-knappen
    const buyBtn = card.querySelector(".buy-btn");
    buyBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Stoppa bubbling
      app.cart.addItem(this);
    });

    return card;
  }
}

/* --- 2. KLASS: SHOPPINGCART ---
   Ansvar: Hantera varukorgens innehåll, räkna priser och uppdatera UI för vagnen. */
class ShoppingCart {
  constructor() {
    this.items = []; // Listan med valda varor
    this.cartCounterEl = document.getElementById("cart-counter");
    this.cartContainerEl = document.getElementById("cart-items");
    this.totalPriceEl = document.getElementById("total-price");
  }

  addItem(product) {
    // Kolla om varan redan finns
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      // Spara objektet och antal
      this.items.push({ product: product, quantity: 1 });
    }

    this.updateCounter();
    // Valfritt: console.log(`Lade till ${product.name}`);
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.renderCart(); // Rita om direkt om modalen är öppen
    this.updateCounter();
  }

  getTotalPrice() {
    return this.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  updateCounter() {
    this.cartCounterEl.innerText = this.getTotalItems();
  }

  // Ritar ut listan inuti varukorgs-modalen
  renderCart() {
    this.cartContainerEl.innerHTML = "";

    if (this.items.length === 0) {
      this.cartContainerEl.innerHTML = "<p>Varukorgen är tom.</p>";
    } else {
      this.items.forEach((item) => {
        const row = document.createElement("div");
        row.style.borderBottom = "1px solid #eee";
        row.style.padding = "10px 0";
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";

        const totalRowPrice = item.product.price * item.quantity;

        row.innerHTML = `
                    <div>
                        <strong>${item.product.name}</strong><br>
                        ${item.quantity} st x ${item.product.price} kr
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>${totalRowPrice} kr</span>
                        <button class="remove-btn" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Ta bort</button>
                    </div>
                `;

        // Koppla ta-bort-knappen
        row.querySelector(".remove-btn").addEventListener("click", () => {
          this.removeItem(item.product.id);
        });

        this.cartContainerEl.appendChild(row);
      });
    }

    this.totalPriceEl.innerText = this.getTotalPrice();
  }
}

/* --- 3. KLASS: PRODUCTMANAGER ---
   Ansvar: Hålla i alla produkter (Databasen) och kunna filtrera dem. */
class ProductManager {
  constructor() {
    this.products = [];
    this.container = document.getElementById("product-container");
  }

  // Lägg till rådata och konvertera till Product-objekt
  loadData(dataList) {
    this.products = dataList.map(
      (data) =>
        new Product(
          data.id,
          data.name,
          data.price,
          data.category,
          data.desc,
          data.image
        )
    );
  }

  render(category = "all") {
    this.container.innerHTML = ""; // Töm container

    const filtered =
      category === "all"
        ? this.products
        : this.products.filter((p) => p.category === category);

    filtered.forEach((product) => {
      // Varje produkt-objekt får skapa sin egen HTML
      const cardElement = product.createCardHTML();
      this.container.appendChild(cardElement);
    });
  }

  getProductById(id) {
    return this.products.find((p) => p.id === id);
  }
}

/* --- 4. KLASS: UI (USER INTERFACE) ---
   Ansvar: Hantera modaler, menyer och navigering. */
class UIManager {
  constructor() {
    this.modalOverlay = document.querySelectorAll(".modal-overlay");
    this.cartModal = document.getElementById("cart-modal");
    this.productModal = document.getElementById("product-modal");
    this.menuBtn = document.getElementById("menu-btn");
    this.nav = document.getElementById("category-nav");

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Stäng modaler om man klickar utanför
    window.onclick = (event) => {
      if (event.target.classList.contains("modal-overlay")) {
        this.closeAllModals();
      }
    };

    // Stäng-knappar (X) i modaler
    document.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.closeAllModals());
    });

    // Mobilmeny-knapp
    if (this.menuBtn) {
      this.menuBtn.addEventListener("click", () => {
        this.nav.classList.toggle("open");
      });
    }

    // Kategorifiltrering
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // UI-uppdatering av knappar
        navButtons.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        // Stäng mobilmenyn
        if (window.innerWidth <= 768) this.nav.classList.remove("open");

        // Be ProductManager filtrera
        const category = e.target.dataset.category;
        app.productManager.render(category);
      });
    });
  }

  openCartModal() {
    app.cart.renderCart(); // Uppdatera vyn innan vi visar
    this.cartModal.classList.remove("hidden");
  }

  openProductModal(product) {
    // Fyll modalen med info
    document.getElementById("modal-title").innerText = product.name;
    document.getElementById("modal-desc").innerText = product.desc;
    document.getElementById("modal-price").innerText = product.price + " kr";
    document.getElementById("modal-img").src = product.image;

    // Hantera köpknappen i modalen
    const btn = document.getElementById("modal-add-btn");
    const newBtn = btn.cloneNode(true); // Rensa gamla events
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", () => {
      app.cart.addItem(product);
      this.closeAllModals();
    });

    this.productModal.classList.remove("hidden");
  }

  closeAllModals() {
    this.modalOverlay.forEach((modal) => modal.classList.add("hidden"));
  }
}

/* --- 5. KLASS: APP (MAIN) ---
   Ansvar: Starta upp allt och knyta ihop säcken. */
class App {
  constructor() {
    this.productManager = new ProductManager();
    this.cart = new ShoppingCart();
    this.ui = new UIManager();

    this.init();
  }

  init() {
    // Rådata (vår "databas")
    const rawData = [
      {
        id: 1,
        name: "Svensk Mellanmjölk",
        price: 15,
        category: "mejeri",
        desc: "Färsk mellanmjölk från svenska gårdar.",
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
        category: "chark",
        desc: "Mörad oxfilé av högsta kvalitet.",
        image: "assets/oxfile.jpg",
      },
      {
        id: 4,
        name: "Chorizo",
        price: 45,
        category: "chark",
        desc: "Kryddig korv med hög kötthalt.",
        image: "assets/chorizo.jpg",
      },
      {
        id: 5,
        name: "Ekologiska Bananer",
        price: 25,
        category: "vego",
        desc: "Rättvisemärkta bananer i klase.",
        image: "assets/bananer.jpg",
      },
      {
        id: 6,
        name: "Avocado",
        price: 15,
        category: "vego",
        desc: "Mogen ätklar avocado.",
        image: "assets/avocado.jpg",
      },
    ];

    // Ladda in data och rita ut startsidan
    this.productManager.loadData(rawData);
    this.productManager.render();
  }
}

/* --- 6. STARTA APPLIKATIONEN --- */
// Vi skapar en global instans så att vi kan nå den från HTML (t.ex. onclick i headern)
const app = new App();

// Globala hjälpfunktioner för HTML-event (t.ex. onclick="openCartModal()")
// Detta behövs eftersom 'app' ligger i JS, men HTML ibland vill kalla på funktioner direkt.
function openCartModal() {
  app.ui.openCartModal();
}

function closeModal(id) {
  app.ui.closeAllModals();
}

function toggleMenu() {
  // UI-klassen hanterar lyssnare, men om du har onclick i HTML kan du styra det härifrån
  const nav = document.getElementById("category-nav");
  nav.classList.toggle("open");
}
