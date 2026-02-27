// Dummy listing data for demo purposes.
// 10 realistic Chennai marriage halls with Tamil-style naming.
const hallData = [
  {
    id: 1,
    name: "Sri Meenakshi Thirumana Mandapam",
    area: "Velachery",
    price: 95000,
    capacity: 450,
    image: "https://placehold.co/600x360/f4ecec/7b1e1e?text=Sri+Meenakshi+Thirumana+Mandapam",
  },
  {
    id: 2,
    name: "Arulmigu Murugan Kalyana Mandapam",
    area: "Tambaram",
    price: 80000,
    capacity: 380,
    image: "https://placehold.co/600x360/fcf3e5/7b1e1e?text=Arulmigu+Murugan+Kalyana+Mandapam",
  },
  {
    id: 3,
    name: "Lakshmi Mahal",
    area: "Porur",
    price: 120000,
    capacity: 600,
    image: "https://placehold.co/600x360/f5efef/7b1e1e?text=Lakshmi+Mahal",
  },
  {
    id: 4,
    name: "Selva Vinayagar Thirukalyana Arangam",
    area: "Ambattur",
    price: 70000,
    capacity: 300,
    image: "https://placehold.co/600x360/fdf8ea/7b1e1e?text=Selva+Vinayagar+Arangam",
  },
  {
    id: 5,
    name: "Nalluramman Thirumana Nilayam",
    area: "Anna Nagar",
    price: 115000,
    capacity: 500,
    image: "https://placehold.co/600x360/f8f1f1/7b1e1e?text=Nalluramman+Thirumana+Nilayam",
  },
  {
    id: 6,
    name: "Gomathi Sankar Mandapam",
    area: "Mylapore",
    price: 130000,
    capacity: 550,
    image: "https://placehold.co/600x360/fff4f4/7b1e1e?text=Gomathi+Sankar+Mandapam",
  },
  {
    id: 7,
    name: "Valli Deivanai Mahal",
    area: "Vadapalani",
    price: 90000,
    capacity: 420,
    image: "https://placehold.co/600x360/f6eded/7b1e1e?text=Valli+Deivanai+Mahal",
  },
  {
    id: 8,
    name: "Kamakshi Amman Kalyana Mandapam",
    area: "T. Nagar",
    price: 150000,
    capacity: 700,
    image: "https://placehold.co/600x360/faf1e7/7b1e1e?text=Kamakshi+Amman+Kalyana+Mandapam",
  },
  {
    id: 9,
    name: "Thiruvalluvar Thirumana Mandapam",
    area: "Perambur",
    price: 85000,
    capacity: 360,
    image: "https://placehold.co/600x360/f9f0f0/7b1e1e?text=Thiruvalluvar+Thirumana+Mandapam",
  },
  {
    id: 10,
    name: "Ponni Nadhi Kalyana Arangam",
    area: "Chromepet",
    price: 105000,
    capacity: 480,
    image: "https://placehold.co/600x360/fef5ea/7b1e1e?text=Ponni+Nadhi+Kalyana+Arangam",
  },
];

const CUSTOM_HALLS_STORAGE_KEY = "chennaiMandapamCustomHalls";

function readCustomHalls() {
  const raw = localStorage.getItem(CUSTOM_HALLS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomHalls(halls) {
  localStorage.setItem(CUSTOM_HALLS_STORAGE_KEY, JSON.stringify(halls));
}

function getAllHalls() {
  // Custom halls are shown first so owners can see their submissions instantly.
  return [...readCustomHalls(), ...hallData];
}

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

  const allHalls = getAllHalls();
  featuredGrid.innerHTML = allHalls.slice(0, 6).map(cardTemplate).join("");
}

function setupHomepageSearch() {
  const form = document.getElementById("homeSearchForm");
  const input = document.getElementById("homeSearchInput");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = input.value.trim();
    const nextUrl = q ? `listings.html?q=${encodeURIComponent(q)}` : "listings.html";
    window.location.href = nextUrl;
  });
}

function setupListingsPage() {
  const listingsGrid = document.getElementById("listingsGrid");
  const priceFilter = document.getElementById("priceFilter");
  const areaFilter = document.getElementById("areaFilter");
  const keywordFilter = document.getElementById("keywordFilter");
  const resultCount = document.getElementById("resultCount");

  if (!listingsGrid || !priceFilter || !areaFilter || !keywordFilter || !resultCount) return;

  const allHalls = getAllHalls();

  // Populate area dropdown from data.
  const uniqueAreas = [...new Set(allHalls.map((hall) => hall.area))].sort();
  uniqueAreas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaFilter.append(option);
  });

  // Read area/query from query string.
  const query = new URLSearchParams(window.location.search);
  const areaParam = query.get("area");
  const qParam = query.get("q");

  if (areaParam && uniqueAreas.includes(areaParam)) {
    areaFilter.value = areaParam;
  }
  if (qParam) {
    keywordFilter.value = qParam;
  }

  function applyFilters() {
    const selectedPrice = priceFilter.value;
    const selectedArea = areaFilter.value;
    const keyword = keywordFilter.value.trim().toLowerCase();

    const filteredData = allHalls.filter((hall) => {
      const passesPrice = selectedPrice === "all" ? true : hall.price <= Number(selectedPrice);
      const passesArea = selectedArea === "all" ? true : hall.area === selectedArea;
      const searchText = `${hall.name} ${hall.area}`.toLowerCase();
      const passesKeyword = keyword ? searchText.includes(keyword) : true;
      return passesPrice && passesArea && passesKeyword;
    });

    resultCount.textContent = `${filteredData.length} halls found`;

    listingsGrid.innerHTML = filteredData.length
      ? filteredData.map(cardTemplate).join("")
      : '<p class="no-results">No halls match the selected filters.</p>';
  }

  priceFilter.addEventListener("change", applyFilters);
  areaFilter.addEventListener("change", applyFilters);
  keywordFilter.addEventListener("input", applyFilters);
  applyFilters();
}

function setupHallForm() {
  const form = document.getElementById("hallForm");
  const popup = document.getElementById("successPopup");
  const closePopup = document.getElementById("closePopup");
  const popupMessage = document.getElementById("popupMessage");

  if (!form || !popup || !closePopup || !popupMessage) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // If form is invalid, browser will show native messages and stop.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const hallName = form.hallName.value.trim();
    const location = form.location.value.trim();
    const area = location.split(",")[0].trim() || "Chennai";
    const price = Number(form.price.value);
    const capacity = Number(form.capacity.value);

    const newHall = {
      id: Date.now(),
      name: hallName,
      area,
      price,
      capacity,
      image: "https://placehold.co/600x360/faf6f6/7b1e1e?text=New+Hall+Listing",
    };

    const existingCustom = readCustomHalls();
    saveCustomHalls([newHall, ...existingCustom]);

    popupMessage.textContent = `Thanks! ${hallName} has been added to local listings.`;
    popup.hidden = false;
    form.reset();

    // Optional redirect so users immediately see the hall they added.
    setTimeout(() => {
      window.location.href = "listings.html?added=1";
    }, 900);
  });

  closePopup.addEventListener("click", () => {
    popup.hidden = true;
  });

  // Optional: close popup by clicking dark backdrop.
  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.hidden = true;
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


function setupAddedMessage() {
  const resultCount = document.getElementById("resultCount");
  if (!resultCount) return;

  const added = new URLSearchParams(window.location.search).get("added");
  if (added === "1") {
    resultCount.textContent = `Hall added successfully. ${resultCount.textContent}`;
  }
}

// Run page features.
renderFeaturedHalls();
setupHomepageSearch();
setupListingsPage();
setupAddedMessage();
setupHallForm();
setupMobileMenu();
updateFooterYear();
