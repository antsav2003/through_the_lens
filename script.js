function normalizeCategory(value) {
  return String(value || "").trim().toLowerCase();
}

function imageHasCategory(image, categoryName) {
  const target = normalizeCategory(categoryName);

  if (Array.isArray(image.categories)) {
    return image.categories.some(
      (cat) => normalizeCategory(cat) === target
    );
  }

  return normalizeCategory(image.category) === target;
}

function loadGallery(containerId, images) {
  const gallery = document.getElementById(containerId);
  if (!gallery) return;

  gallery.innerHTML = "";

  images.forEach((image, index) => {
    const img = document.createElement("img");

    const src = image.imageUrl || `images/${image.filename}`;
    img.src = src;
    img.alt = image.title || image.filename || "Gallery image";

    img.addEventListener("load", () => {
      setTimeout(() => {
        img.classList.add("show");
      }, index * 120);
    });

    img.addEventListener("click", () => {
      openLightbox(img.src);
    });

    gallery.appendChild(img);
  });
}

function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = src;
  lightbox.style.display = "flex";

  requestAnimationFrame(() => {
    lightbox.classList.add("show");
  });
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("show");

  setTimeout(() => {
    lightbox.style.display = "none";
  }, 300);
}

document.addEventListener("click", function (e) {
  if (
    e.target.id === "lightbox" ||
    e.target.classList.contains("lightbox-close")
  ) {
    closeLightbox();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeLightbox();
  }
});

async function initGalleries() {
  try {
    const response = await fetch("gallery-data.json");
    const galleryData = await response.json();

    const uploadedImages =
      JSON.parse(localStorage.getItem("galleryData")) || [];

    const allGalleryData = [...galleryData, ...uploadedImages];

    loadGallery(
      "featured-gallery",
      allGalleryData.filter((img) => img.featured)
    );

    loadGallery(
      "portraits-gallery",
      allGalleryData.filter((img) => imageHasCategory(img, "portraits"))
    );

    loadGallery(
      "nature-gallery",
      allGalleryData.filter((img) => imageHasCategory(img, "nature"))
    );

    loadGallery(
      "events-gallery",
      allGalleryData.filter((img) => imageHasCategory(img, "events"))
    );

    loadGallery(
      "architecture-gallery",
      allGalleryData.filter((img) => imageHasCategory(img, "architecture"))
    );

    loadGallery(
      "lifestyle-gallery",
      allGalleryData.filter((img) => imageHasCategory(img, "lifestyle"))
      
    );
      loadGallery(
        "creative-gallery",
        allGalleryData.filter((img) => imageHasCategory(img, "creative"))
      );
      loadGallery(
        "automotive-gallery",
        allGalleryData.filter((img) => imageHasCategory(img, "automotive"))
      );
  } catch (error) {
    console.error("Failed to load gallery data:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");

  if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
  }

  const heroImage = localStorage.getItem("heroImage");

  if (heroImage) {
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      const heroOptimized = heroImage.replace(
        "/upload/",
        "/upload/w_2200,q_auto:good,f_auto/"
      );

      heroSection.style.background = `
        linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.7)),
        url(${heroOptimized}) center/cover no-repeat
      `;
    }
  }

  initGalleries();
});