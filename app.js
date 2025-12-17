// =========================================================
// 1. DATABAS (Våra produkter)
// =========================================================
const products = [
  // --- MEJERI ---
  {
    id: 1,
    name: "Svensk Standardmjök",
    price: 15,
    category: "mejeri",
    desc: "Färsk standardmjölk från svenska gårdar.",
    image: "assets/mjolk.jpg",
  },
  {
    id: 2,
    name: "Herrgårdsost",
    price: 89,
    category: "mejeri",
    desc: "Mild och gräddig ost, lagrad 12 mån.",
    image: "assets/ost.jpg",
  },
  {
    id: 7,
    name: "Vispgrädde",
    price: 22,
    category: "mejeri",
    desc: "Perfekt till tårtan, 40% fetthalt.",
    image: "assets/vispgradde.png",
  },
  {
    id: 8,
    name: "Grekisk Yoghurt",
    price: 35,
    category: "mejeri",
    desc: "Krämig yoghurt med 10% fett.",
    image: "assets/yoghurt.png",
  },
  {
    id: 9,
    name: "Smör Normalsaltat",
    price: 55,
    category: "mejeri",
    desc: "Svenskt smör, 500g.",
    image: "assets/smor.jpg",
  },
  {
    id: 10,
    name: "Filmjölk",
    price: 18,
    category: "mejeri",
    desc: "Klassisk svensk filmjölk.",
    image: "assets/filmjolk.avif",
  },

  // --- KÖTT ---
  {
    id: 3,
    name: "Oxfilé Premium",
    price: 299,
    category: "kott",
    desc: "Mörad oxfilé av högsta kvalitet.",
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
    id: 11,
    name: "Blandfärs",
    price: 89,
    category: "kott",
    desc: "Svensk blandfärs 50/50, 1kg.",
    image: "assets/fars.avif",
  },
  {
    id: 12,
    name: "Kycklingfilé",
    price: 120,
    category: "kott",
    desc: "Fryst kycklingfilé, 1kg.",
    image: "assets/kyckling.avif",
  },
  {
    id: 13,
    name: "Entrecôte",
    price: 249,
    category: "kott",
    desc: "Välmarmorerad bit kött.",
    image: "assets/entrecote.jpg",
  },
  {
    id: 14,
    name: "Bacon",
    price: 15,
    category: "kott",
    desc: "Rökt sidfläsk i skivor.",
    image: "assets/bacon.avif",
  },

  // --- FRUKT ---
  {
    id: 5,
    name: "Eko Bananer",
    price: 25,
    category: "frukt",
    desc: "Rättvisemärkta bananer i klase.",
    image: "assets/bananer.jpg",
  },
  {
    id: 15,
    name: "Äpplen Royal Gala",
    price: 29,
    category: "frukt",
    desc: "Söta och krispiga äpplen, 1kg.",
    image: "assets/apple.webp",
  },
  {
    id: 16,
    name: "Apelsiner",
    price: 32,
    category: "frukt",
    desc: "Saftiga apelsiner för juice.",
    image: "assets/apelsin.webp",
  },
  {
    id: 17,
    name: "Vindruvor",
    price: 40,
    category: "frukt",
    desc: "Kärnfria gröna vindruvor.",
    image: "assets/druvor.jpg",
  },
  {
    id: 18,
    name: "Päron Conference",
    price: 35,
    category: "frukt",
    desc: "Mjuka och söta päron.",
    image: "assets/paron.jpg",
  },
  {
    id: 19,
    name: "Citroner",
    price: 15,
    category: "frukt",
    desc: "Syrliga citroner i nät, 500g.",
    image: "assets/citron.webp",
  },

  // --- GRÖNT ---
  {
    id: 6,
    name: "Avocado",
    price: 15,
    category: "gront",
    desc: "Mogen ätklar avocado, 2-pack.",
    image: "assets/avocado.jpg",
  },
  {
    id: 20,
    name: "Gurka",
    price: 12,
    category: "gront",
    desc: "Svensk odlad gurka.",
    image: "assets/gurka.webp",
  },
  {
    id: 21,
    name: "Tomater",
    price: 35,
    category: "gront",
    desc: "Kvisttomater, rika på smak.",
    image: "assets/tomat.jpg",
  },
  {
    id: 22,
    name: "Isbergssallad",
    price: 20,
    category: "gront",
    desc: "Krispigt salladshuvud.",
    image: "assets/sallad.jpg",
  },
  {
    id: 23,
    name: "Morötter",
    price: 15,
    category: "gront",
    desc: "Eko morötter i påse, 1kg.",
    image: "assets/morot.jpg",
  },
  {
    id: 24,
    name: "Paprika Röd",
    price: 10,
    category: "gront",
    desc: "Söt röd paprika, styckpris.",
    image: "assets/paprika.webp",
  },
];

const CATEGORY_MAPPING = {
  home: "all",
  mejeri: "mejeri",
  kott: "kott",
  frukt: "frukt",
  gront: "gront",
};

// =========================================================
// 2. STATE & UI REFERENSER
// =========================================================
let cart = [];
const productContainer = document.getElementById("product-container");
const cartCounter = document.getElementById("cart-counter");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const cartModal = document.getElementById("cart-modal");

// =========================================================
// 3. LOGIK
// =========================================================

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
}
function toggleMenu() {
  const nav = document.getElementById("category-nav");
  nav.classList.toggle("open");
}

function addToCart(productId, event) {
  if (event) event.stopPropagation();
  const productToAdd = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  // Feedback animation på knappen
  const btn = event.target;
  const originalText = btn.innerText;
  btn.style.backgroundColor = "#4CAF50"; // Grön för bekräftelse
  btn.innerText = "✓";
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.backgroundColor = ""; // Återställ färg (hanteras av CSS)
  }, 1000);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...productToAdd, quantity: 1 });
  }
  updateCartUI();
  renderCartList();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCartList();
  updateCartUI();
}

function updateCartUI() {
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCounter) cartCounter.innerText = totalItems;
}

function renderCartList() {
  cartItemsContainer.innerHTML = "";
  let totalCost = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Varukorgen är tom.</p>";
  } else {
    cart.forEach((item) => {
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
                    })" class="buy-btn" style="background:#ff4444; padding:5px 10px; width:auto; font-size:0.8rem; margin:0; height:auto;">Ta bort</button>
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
// 4. RENDERING (NYA KORT UTAN BESKRIVNING)
// =========================================================

function renderProducts(productList) {
  if (!productContainer) return;

  productContainer.innerHTML = "";

  productList.forEach((product) => {
    const card = document.createElement("article");
    card.classList.add("product-card");

    // HÄR ÄR ÄNDRINGEN: Ingen beskrivning renderas
    card.innerHTML = `
            <div class="card-image-container">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/200x150?text=Ingen+Bild'">
            </div>
            <div class="card-content">
                <h3 class="card-title">${product.name}</h3>
                <div class="card-footer">
                    <span class="card-price">${product.price}:-</span>
                    <button class="add-btn" onclick="addToCart(${product.id}, event)">
                        Köp
                    </button>
                </div>
            </div>
        `;
    productContainer.appendChild(card);
  });
}

function loadPageProducts() {
  const path = window.location.pathname.split("/").pop();
  let categoryKey = "home";

  if (path !== "home.html" && path !== "") {
    categoryKey = path.split(".")[0];
  }
  categoryKey = categoryKey.toLowerCase();

  const categoryToFilter = CATEGORY_MAPPING[categoryKey] || "all";
  let productsToRender = products;

  if (categoryToFilter !== "all") {
    productsToRender = products.filter((p) => p.category === categoryToFilter);
  }
  renderProducts(productsToRender);
}

// =========================================================
// 5. STARTUP
// =========================================================

function loadInitialCart() {
  // Starta med tom vagn
}

window.onclick = function (event) {
  if (
    event.target.classList &&
    event.target.classList.contains("modal-overlay")
  ) {
    event.target.classList.add("hidden");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadInitialCart();
  loadPageProducts();
  updateCartUI();
});
