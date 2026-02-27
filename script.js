// Dummy listing data for demo purposes.
// 10 realistic Chennai marriage halls with Tamil-style naming.
const hallData = [
  {
    id: 1,
    name: "ஸ்ரீ மீனாட்சி திருமண மண்டபம்",
    area: "Velachery",
    price: 95000,
    capacity: 450,
    image: "https://placehold.co/600x360/f4ecec/7b1e1e?text=Sri+Meenakshi+Thirumana+Mandapam",
  },
  {
    id: 2,
    name: "அருள்மிகு முருகன் கல்யாண மண்டபம்",
    area: "Tambaram",
    price: 80000,
    capacity: 380,
    image: "https://placehold.co/600x360/fcf3e5/7b1e1e?text=Arulmigu+Murugan+Kalyana+Mandapam",
  },
  {
    id: 3,
    name: "லட்சுமி மகால்",
    area: "Porur",
    price: 120000,
    capacity: 600,
    image: "https://placehold.co/600x360/f5efef/7b1e1e?text=Lakshmi+Mahal",
  },
  {
    id: 4,
    name: "செல்வ விநாயகர் திருக்கல்யாண அரங்கம்",
    area: "Ambattur",
    price: 70000,
    capacity: 300,
    image: "https://placehold.co/600x360/fdf8ea/7b1e1e?text=Selva+Vinayagar+Arangam",
  },
  {
    id: 5,
    name: "நல்லூரம்மன் திருமண நிலையம்",
    area: "Anna Nagar",
    price: 115000,
    capacity: 500,
    image: "https://placehold.co/600x360/f8f1f1/7b1e1e?text=Nalluramman+Thirumana+Nilayam",
  },
  {
    id: 6,
    name: "கோமதி சங்கர் மண்டபம்",
    area: "Mylapore",
    price: 130000,
    capacity: 550,
    image: "https://placehold.co/600x360/fff4f4/7b1e1e?text=Gomathi+Sankar+Mandapam",
  },
  {
    id: 7,
    name: "வள்ளி தெய்வானை மகால்",
    area: "Vadapalani",
    price: 90000,
    capacity: 420,
    image: "https://placehold.co/600x360/f6eded/7b1e1e?text=Valli+Deivanai+Mahal",
  },
  {
    id: 8,
    name: "காமாட்சி அம்மன் கல்யாண மண்டபம்",
    area: "T. Nagar",
    price: 150000,
    capacity: 700,
    image: "https://placehold.co/600x360/faf1e7/7b1e1e?text=Kamakshi+Amman+Kalyana+Mandapam",
  },
  {
    id: 9,
    name: "திருவள்ளுவர் திருமண மண்டபம்",
    area: "Perambur",
    price: 85000,
    capacity: 360,
    image: "https://placehold.co/600x360/f9f0f0/7b1e1e?text=Thiruvalluvar+Thirumana+Mandapam",
  },
  {
    id: 10,
    name: "பொன்னி நதி கல்யாண அரங்கம்",
    area: "Chromepet",
    price: 105000,
    capacity: 480,
    image: "https://placehold.co/600x360/fef5ea/7b1e1e?text=Ponni+Nadhi+Kalyana+Arangam",
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
  featuredGrid.innerHTML = hallData.slice(0, 6).map(cardTemplate).join("");
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

    // If form is invalid, browser will show native messages and stop.
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

// Run page features.
renderFeaturedHalls();
setupListingsPage();
setupHallForm();
setupMobileMenu();
updateFooterYear();
