
const products = [
  { id: 1, name: "Airbus A320", price: 34.90, category: "commercial" },
  { id: 2, name: "F-16 Fighting Falcon", price: 42.50, category: "military" },
  { id: 3, name: "Spitfire Mk IX", price: 29.90, category: "classic" },
  { id: 4, name: "Boeing 747", price: 49.90, category: "commercial" },
  { id: 5, name: "P-51 Mustang", price: 31.50, category: "military" },
  { id: 6, name: "Cessna 172 Skyhawk", price: 24.90, category: "classic" }
];

const cart = new Map();

let activeCategory = "all";

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const cartTotal = document.getElementById("cartTotal");
const productSearch = document.getElementById("productSearch");
const productGrid = document.getElementById("productGrid");
const noProducts = document.getElementById("noProducts");
const toastMessage = document.getElementById("toastMessage");

const toastElement = document.getElementById("shopToast");
const shopToast = bootstrap.Toast.getOrCreateInstance(toastElement);

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

function formatPrice(price) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(price);
}

function showToast(message) {
  toastMessage.textContent = message;
  shopToast.show();
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  const currentQuantity = cart.get(productId) || 0;
  cart.set(productId, currentQuantity + 1);

  renderCart();
  showToast(`${product.name} added to cart`);
}

function changeQuantity(productId, change) {
  const currentQuantity = cart.get(productId) || 0;
  const newQuantity = currentQuantity + change;

  if (newQuantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, newQuantity);
  }

  renderCart();
}

function removeFromCart(productId) {
  const product = products.find(item => item.id === productId);

  cart.delete(productId);
  renderCart();

  if (product) {
    showToast(`${product.name} removed from cart`);
  }
}

function renderCart() {
  let itemCount = 0;
  let subtotal = 0;

  cart.forEach((quantity, productId) => {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    itemCount += quantity;
    subtotal += product.price * quantity;
  });

  cartCount.textContent = itemCount;
  cartItems.innerHTML = "";

  cartEmpty.hidden = itemCount > 0;
  cartSummary.hidden = itemCount === 0;

  cart.forEach((quantity, productId) => {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const item = document.createElement("div");
    item.className = "cart-item";

    const details = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("div");
    price.className = "cart-item-price";
    price.textContent = formatPrice(product.price * quantity);

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const decreaseButton = createIconButton(
      "ti ti-minus",
      `Decrease quantity of ${product.name}`,
      () => changeQuantity(productId, -1)
    );

    const quantityText = document.createElement("span");
    quantityText.textContent = quantity;
    quantityText.setAttribute("aria-label", "Quantity");

    const increaseButton = createIconButton(
      "ti ti-plus",
      `Increase quantity of ${product.name}`,
      () => changeQuantity(productId, 1)
    );

    quantityControls.append(
      decreaseButton,
      quantityText,
      increaseButton
    );

    details.append(name, price, quantityControls);

    const removeButton = createIconButton(
      "ti ti-trash",
      `Remove ${product.name} from cart`,
      () => removeFromCart(productId)
    );

    removeButton.classList.add("remove-item");

    item.append(details, removeButton);
    cartItems.appendChild(item);
  });

  cartTotal.textContent = formatPrice(subtotal);
}

function createIconButton(iconClass, label, callback) {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", label);

  const icon = document.createElement("i");
  icon.className = iconClass;

  button.appendChild(icon);
  button.addEventListener("click", callback);

  return button;
}

// Add-to-cart buttons
document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => {
    const productId = Number(button.dataset.add);
    addToCart(productId);
  });
});

// Product category filters
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(filterButton => {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    activeCategory = button.dataset.filter;

    filterProducts();
  });
});

// Product search
productSearch.addEventListener("input", filterProducts);

function filterProducts() {
  const searchTerm = productSearch.value.trim().toLowerCase();
  const productColumns = document.querySelectorAll(".product-column");

  let visibleCount = 0;

  productColumns.forEach(column => {
    const category = column.dataset.category;
    const name = column.dataset.name.toLowerCase();

    const matchesCategory =
      activeCategory === "all" || category === activeCategory;

    const matchesSearch = name.includes(searchTerm);
    const shouldShow = matchesCategory && matchesSearch;

    column.hidden = !shouldShow;

    if (shouldShow) visibleCount++;
  });

  noProducts.hidden = visibleCount > 0;
}

// Demo checkout only — no payment or order is processed.
document.getElementById("checkoutButton").addEventListener("click", () => {
  showToast("Demo only — payment checkout is not connected.");
});

// Initial render
renderCart();

const cartPanel = document.querySelector("#cartPanel");

cartPanel.addEventListener("click", () => {
    gtag('event', 'cart_views')
    console.log('Cart panel viewed');
});
