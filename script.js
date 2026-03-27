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

  if (Array.isArray(image.category)) {
    return image.category.some(
      (cat) => normalizeCategory(cat) === target
    );
  }

  return normalizeCategory(image.category) === target;
}

ffunction loadGallery(containerId, images) {
  const gallery = document.getElementById(containerId);
  if (!gallery) return;

  gallery.innerHTML = "";

  images.forEach((image, index) => {
    const img = document.createElement("img");

    const src = image.imageUrl || `images/${image.filename}`;

    img.alt = image.title || image.filename || "Gallery image";

    img.addEventListener("load", () => {
      setTimeout(() => {
        img.classList.add("show");
      }, index * 120);
    });

    img.addEventListener("error", () => {
      console.error("Failed to load image:", src);
      img.style.opacity = "1";
      img.alt = "Failed to load image";
    });

    img.addEventListener("click", () => {
      openLightbox(img.src);
    });

    img.src = src;

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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const galleryData = await response.json();
    const allGalleryData = Array.isArray(galleryData) ? galleryData : [];

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

  initGalleries();
});
