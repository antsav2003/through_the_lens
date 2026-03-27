function loadGallery(containerId, images) {
  const gallery = document.getElementById(containerId);
  if (!gallery) return;

  images.forEach((file, index) => {
    const img = document.createElement("img");
    img.src = `images/${file}`;
    img.alt = file;

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
  if (e.target.id === "lightbox" || e.target.classList.contains("lightbox-close")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeLightbox();
  }
});

loadGallery("featured-gallery", [
  "portrait4.jpg",
  "portrait1.jpg",
  "lifestyle1.jpg",
  "portrait2.jpg",
  "event1.jpg",
  "hero.jpg"
]);

loadGallery("portraits-gallery", [
  "portrait4.jpg",
  "portrait1.jpg",
  "portrait2.jpg",
  "portrait3.jpg",
  "portrait5.jpg"
]);

loadGallery("nature-gallery", [
  "nature1.jpg",
  "nature2.jpg",
  "architecture1.jpg"
]);

loadGallery("events-gallery", [
  "event1.jpg",
  "event2.jpg",
  "lifestyle2.jpg",
  "lifestyle3.jpg"
]);

loadGallery("architecture-gallery", [
  "architecture1.jpg"
]);

loadGallery("lifestyle-gallery", [
  "lifestyle1.jpg",
  "lifestyle2.jpg",
  "lifestyle3.jpg"
]);

//calendar
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");

  if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
  }
});