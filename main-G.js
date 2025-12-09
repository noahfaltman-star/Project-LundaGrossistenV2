/* --- 1. DATABAS (Våra produkter) --- */
// En array av objekt. Detta simulerar en databas.
// Varje objekt {} representerar en produkt.
const products = [
  {
    id: 1,
    name: "Svensk Mellanmjölk",
    price: 15,
    category: "mejeri", // Används för filtrering
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
    category: "chark",
    desc: "Mörad oxfilé av högsta kvalitet. Perfekt till helgen.",
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
    desc: "Rättvisemärkta bananer. Säljs i klase.",
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

/* --- 2. TILLSTÅND (State) --- */
let cart = []; // Här sparas produkterna som användaren köper

/* --- 3. REFERENSER TILL HTML --- */
// Vi sparar elementen i variabler så vi slipper söka efter dem hela tiden
const productContainer = document.getElementById("product-container");
const cartCounter = document.getElementById("cart-counter");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");

/* --- 4. FUNKTION FÖR ATT RITA UT PRODUKTER --- */
// Tar emot en lista (array) med produkter och skapar HTML för dem
function renderProducts(productList) {
  // Töm först containern så vi inte får dubbletter när vi filtrerar
  productContainer.innerHTML = "";

  // Loopa igenom varje produkt i listan
  productList.forEach((product) => {
    // Skapa en ny <div> för kortet
    const card = document.createElement("div");
    card.classList.add("product-card");

    // Fyll div:en med HTML (bild, titel, pris, knapp)
    // ${...} används för att sätta in variabler i strängen
    card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} kr</p>
            <button class="buy-btn" onclick="addToCart(${product.id}, event)">Köp</button>
        `;

    // Lägg till en klick-lyssnare på hela kortet
    card.addEventListener("click", (e) => {
      // Om man INTE klickade på knappen (utan på kortet), öppna modalen
      if (e.target.tagName !== "BUTTON") {
        openProductModal(product);
      }
    });

    // Stoppa in kortet i grid-behållaren på sidan
    productContainer.appendChild(card);
  });
}

// Kör funktionen direkt vid start för att visa alla produkter
renderProducts(products);

/* --- 5. FILTRERING (MENYN) --- */
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Ta bort "active"-klassen från alla knappar
    navButtons.forEach((b) => b.classList.remove("active"));
    // Lägg till "active" på den vi just klickade på
    e.target.classList.add("active");

    // Hämta kategorin från html-attributet (data-category="...")
    const category = e.target.dataset.category;

    // Om vi är på mobil: stäng menyn när man valt kategori
    if (window.innerWidth <= 768) {
      document.getElementById("category-nav").classList.remove("open");
    }

    if (category === "all") {
      renderProducts(products); // Visa alla
    } else {
      // .filter() skapar en NY array med bara de som matchar
      const filtered = products.filter((p) => p.category === category);
      renderProducts(filtered);
    }
  });
});

/* --- 6. MOBIL MENY FUNKTION --- */
function toggleMenu() {
  const nav = document.getElementById("category-nav");
  // .toggle() lägger till klassen om den saknas, tar bort om den finns
  nav.classList.toggle("open");
}

/* --- 7. VARUKORGS-LOGIK --- */

// Lägg till vara
function addToCart(productId, event) {
  // stopPropagation gör att klicket inte "bubblar upp" till kortet och öppnar modalen
  if (event) event.stopPropagation();

  // Hitta produkten i "databasen" baserat på ID
  const productToAdd = products.find((p) => p.id === productId);

  // Kolla om vi redan har den i varukorgen
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++; // Öka antal
  } else {
    // Lägg till ny produkt i arrayen
    cart.push({ ...productToAdd, quantity: 1 });
  }

  updateCartUI(); // Uppdatera siffran i hörnet
}

// Ta bort vara
function removeFromCart(productId) {
  // .filter() sparar alla varor SOM INTE har det ID vi vill ta bort
  cart = cart.filter((item) => item.id !== productId);
  renderCartList(); // Rita om listan i modalen
  updateCartUI(); // Uppdatera siffran
}

// Uppdatera den röda siffran
function updateCartUI() {
  let totalItems = 0;
  cart.forEach((item) => (totalItems += item.quantity));
  cartCounter.innerText = totalItems;
}

// Rita ut listan inuti varukorgs-modalen
function renderCartList() {
  cartItemsContainer.innerHTML = "";
  let totalCost = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Varukorgen är tom.</p>";
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalCost += itemTotal;

      // Skapa HTML för en rad i varukorgen
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
                    <span>${itemTotal} kr</span>
                    <button onclick="removeFromCart(${item.id})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Ta bort</button>
                </div>
            `;
      cartItemsContainer.appendChild(row);
    });
  }

  totalPriceEl.innerText = totalCost;
}

/* --- 8. MODALER (Öppna/Stänga fönster) --- */

function openCartModal() {
  renderCartList(); // Se till att listan är uppdaterad innan vi visar den
  document.getElementById("cart-modal").classList.remove("hidden");
}

function openProductModal(product) {
  // Fyll modalen med info från den klickade produkten
  document.getElementById("modal-title").innerText = product.name;
  document.getElementById("modal-desc").innerText = product.desc;
  document.getElementById("modal-price").innerText = product.price + " kr";
  document.getElementById("modal-img").src = product.image;

  // Hantera knappen i modalen
  const btn = document.getElementById("modal-add-btn");

  // Klona knappen för att rensa gamla event listeners (viktigt!)
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener("click", () => {
    addToCart(product.id);
    closeModal("product-modal");
  });

  document.getElementById("product-modal").classList.remove("hidden");
}

function closeModal(modalId) {
  // Lägg tillbaka 'hidden'-klassen för att dölja
  document.getElementById(modalId).classList.add("hidden");
}

// Stäng om man klickar på den mörka bakgrunden (overlay)
window.onclick = function (event) {
  if (event.target.classList.contains("modal-overlay")) {
    event.target.classList.add("hidden");
  }
};
