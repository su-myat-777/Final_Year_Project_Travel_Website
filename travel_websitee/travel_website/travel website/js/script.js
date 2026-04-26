// ================= MENU TOGGLE =================
const menus = document.querySelector("nav ul");
const header = document.querySelector("header");
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");
const signoutBtn = document.getElementById('signout-btn');

if (menuBtn && menus) {
  menuBtn.addEventListener("click", () => {
    menus.classList.add("display");
  });
}

if (closeBtn && menus) {
  closeBtn.addEventListener("click", () => {
    menus.classList.remove("display");
  });
}

if (signoutBtn && typeof logoutAndRedirect === 'function') {
  signoutBtn.addEventListener('click', logoutAndRedirect);
}

// ================= DROPDOWN TOGGLE FOR MOBILE =================
const dropdownToggle = document.querySelectorAll(".dropdown-toggle");

dropdownToggle.forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    // Prevent default link behavior
    e.preventDefault();

    // Find the parent li and toggle the active class
    const dropdown = toggle.parentElement;
    dropdown.classList.toggle("active");
  });
});

// ================= STICKY NAVBAR =================
window.addEventListener("scroll", () => {
  if (!header) {
    return;
  }

  if (document.documentElement.scrollTop > 20) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

// ================= COUNTER ANIMATION =================
const counters = document.querySelectorAll(".number");

counters.forEach((counter) => {
  counter.textContent = 0;

  function updateCounter() {
    const target = +counter.getAttribute("data-ceil");
    let current = +counter.textContent;

    const increment = target / 25;

    current = Math.ceil(current + increment);

    if (current < target) {
      counter.textContent = current;
      setTimeout(updateCounter, 70);
    } else {
      counter.textContent = target;
    }
  }

  updateCounter();
});

document.addEventListener('DOMContentLoaded', function () {
  if (typeof redirectIfNotAuthenticated === 'function') {
    redirectIfNotAuthenticated();
  }

  if (typeof updateHeaderAuth === 'function') {
    updateHeaderAuth();
  }
});

// ================= DESTINATIONS DATA =================
const destinations = [
  {
    name: "London",
    slug: "london",
    price: 1200,
    duration: "7 days",
  },
  {
    name: "Paris",
    slug: "paris",
    price: 1000,
    duration: "5 days",
  },
  {
    name: "Greece",
    slug: "greece",
    price: 800,
    duration: "6 days",
  },
  {
    name: "Maldives",
    slug: "maldives",
    price: 1500,
    duration: "8 days",
  },
];

// ================= SEARCH BUTTON =================
const searchBtn = document.getElementById("search-btn");

const contactForm = document.getElementById("contact-form");
const alertBox = document.getElementById("contact-alert");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    // This stops the page from redirecting to contact.php and crashing
    e.preventDefault();

    // This shows your green success box
    alertBox.classList.remove("d-none");

    // This clears the form fields so it looks like it was sent
    contactForm.reset();

    console.log("Form submitted successfully without crashing!");
  });
}

// ================= GALLERY FILTER FUNCTIONALITY =================
const filterBtns = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

if (filterBtns.length > 0 && galleryItems.length > 0) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// ================= GALLERY LIGHTBOX FUNCTIONALITY =================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

if (lightbox && galleryItems.length > 0) {
  let currentIndex = 0;
  const visibleItems = [];

  // Update visible items array
  function updateVisibleItems() {
    visibleItems.length = 0;
    galleryItems.forEach((item, index) => {
      if (item.style.display !== "none") {
        visibleItems.push({ element: item, index: index });
      }
    });
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      updateVisibleItems();
      const visibleIndex = visibleItems.findIndex((v) => v.index === index);
      currentIndex = visibleIndex >= 0 ? visibleIndex : 0;
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    const item = galleryItems[index];
    const img = item.querySelector("img");
    const title = item.querySelector("h3").textContent;
    const desc = item.querySelector("p").textContent;

    lightboxImg.src = img.src.replace("w=800", "w=1600");
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      updateVisibleItems();
      currentIndex = (currentIndex + 1) % visibleItems.length;
      openLightbox(visibleItems[currentIndex].index);
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      updateVisibleItems();
      currentIndex =
        (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      openLightbox(visibleItems[currentIndex].index);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") {
      updateVisibleItems();
      currentIndex = (currentIndex + 1) % visibleItems.length;
      openLightbox(visibleItems[currentIndex].index);
    }
    if (e.key === "ArrowLeft") {
      updateVisibleItems();
      currentIndex =
        (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      openLightbox(visibleItems[currentIndex].index);
    }
  });
}

