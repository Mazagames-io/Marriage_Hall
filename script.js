// Dummy listing data for demo purposes.
const hallData = [
  {
    id: 1,
    name: "Grand Velachery Mahal",
    area: "Velachery",
    price: 110000,
    capacity: 500,
    image: "https://placehold.co/600x360/f4ecec/7b1e1e?text=Grand+Velachery+Mahal",
  },
  {
    id: 2,
    name: "Tambaram Royal Palace",
    area: "Tambaram",
    price: 85000,
    capacity: 350,
    image: "https://placehold.co/600x360/fcf3e5/7b1e1e?text=Tambaram+Royal+Palace",
  },
  {
    id: 3,
    name: "Porur Crown Convention",
    area: "Porur",
    price: 140000,
    capacity: 700,
    image: "https://placehold.co/600x360/f5efef/7b1e1e?text=Porur+Crown+Convention",
  },
  {
    id: 4,
    name: "Ambattur Harmony Hall",
    area: "Ambattur",
    price: 65000,
    capacity: 280,
    image: "https://placehold.co/600x360/fdf8ea/7b1e1e?text=Ambattur+Harmony+Hall",
  },
  {
    id: 5,
    name: "Anna Nagar Lotus Mandapam",
    area: "Anna Nagar",
    price: 125000,
    capacity: 450,
    image: "https://placehold.co/600x360/f8f1f1/7b1e1e?text=Lotus+Mandapam",
  },
  {
    id: 6,
    name: "ECR Golden Banquet",
    area: "ECR",
    price: 190000,
    capacity: 900,
    image: "https://placehold.co/600x360/fff4f4/7b1e1e?text=ECR+Golden+Banquet",
  },
];

// Utility: format numbers as INR currency.
function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Reusable card renderer.
function cardTemplate(hall) {
  return `
    <article class="hall-card">
      <img src="${hall.image}" alt="${hall.name} in ${hall.area}" loading="lazy" />
      <div class="hall-card-content">
        <h3>${hall.name}</h3>
        <p class="hall-meta">${hall.area} • Capacity: ${hall.capacity} guests</p>
        <div class="card-actions">
          <span class="price">From ${formatPrice(hall.price)}</span>
          <a class="btn-secondary" href="hall.html">View Details</a>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedHalls() {
  const featuredGrid = document.getElementById("featuredGrid");
  if (!featuredGrid) return;
  featuredGrid.innerHTML = hallData.slice(0, 4).map(cardTemplate).join("");
}

function setupListingsPage() {
  const listingsGrid = document.getElementById("listingsGrid");
  const priceFilter = document.getElementById("priceFilter");
  const areaFilter = document.getElementById("areaFilter");

  if (!listingsGrid || !priceFilter || !areaFilter) return;

  // Populate area dropdown from data.
  const uniqueAreas = [...new Set(hallData.map((hall) => hall.area))].sort();
  uniqueAreas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaFilter.append(option);
  });

  // Read area from query string (e.g., listings.html?area=Tambaram)
  const areaParam = new URLSearchParams(window.location.search).get("area");
  if (areaParam && uniqueAreas.includes(areaParam)) {
    areaFilter.value = areaParam;
  }

  function applyFilters() {
    const selectedPrice = priceFilter.value;
    const selectedArea = areaFilter.value;

    const filteredData = hallData.filter((hall) => {
      const passesPrice = selectedPrice === "all" ? true : hall.price <= Number(selectedPrice);
      const passesArea = selectedArea === "all" ? true : hall.area === selectedArea;
      return passesPrice && passesArea;
    });

    listingsGrid.innerHTML = filteredData.length
      ? filteredData.map(cardTemplate).join("")
      : '<p>No halls match the selected filters.</p>';
  }

  priceFilter.addEventListener("change", applyFilters);
  areaFilter.addEventListener("change", applyFilters);
  applyFilters();
}

function setupHallForm() {
  const form = document.getElementById("hallForm");
  const popup = document.getElementById("successPopup");
  const closePopup = document.getElementById("closePopup");

  if (!form || !popup || !closePopup) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Basic check: let browser validation handle required fields.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    popup.hidden = false;
    form.reset();
  });

  closePopup.addEventListener("click", () => {
    popup.hidden = true;
  });
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

function updateFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Run page features.
renderFeaturedHalls();
setupListingsPage();
setupHallForm();
setupMobileMenu();
updateFooterYear();
