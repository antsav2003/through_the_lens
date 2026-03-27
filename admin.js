function compressImage(file, maxWidth = 2000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression failed"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("Invalid image file"));

    reader.readAsDataURL(file);
  });
}

function getSavedImages() {
  return JSON.parse(localStorage.getItem("galleryData")) || [];
}

function saveImages(images) {
  localStorage.setItem("galleryData", JSON.stringify(images));
}

function renderAdminGallery() {
  const container = document.getElementById("admin-gallery");
  if (!container) return;

  const images = getSavedImages();
  const currentHero = localStorage.getItem("heroImage");

  container.innerHTML = "";

  const allCategories = [
    "portraits",
    "nature",
    "events",
    "architecture",
    "lifestyle",
    "creative",
    "automotive"
  ];

  images.forEach((imgData, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.maxWidth = "300px";
    wrapper.style.background = "#1b1b1b";
    wrapper.style.border = "1px solid #333";
    wrapper.style.borderRadius = "10px";
    wrapper.style.padding = "12px";

    const img = document.createElement("img");
    img.src = imgData.imageUrl;
    img.alt = imgData.title || "Uploaded image";
    img.style.width = "100%";
    img.style.borderRadius = "10px";
    img.style.display = "block";
    img.classList.add("show");

    const title = document.createElement("p");
    title.textContent = imgData.title || "Untitled";
    title.style.textAlign = "center";
    title.style.marginTop = "10px";
    title.style.marginBottom = "6px";
    title.style.color = "#ccc";
    title.style.fontSize = "15px";

    const categoryText = document.createElement("p");
    const currentCategories = Array.isArray(imgData.categories)
      ? imgData.categories
      : imgData.category
      ? [imgData.category]
      : [];

    categoryText.textContent = `Categories: ${currentCategories.join(", ") || "None"}`;
    categoryText.style.textAlign = "center";
    categoryText.style.marginBottom = "10px";
    categoryText.style.color = "#888";
    categoryText.style.fontSize = "13px";

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.flexDirection = "column";
    controls.style.gap = "8px";

    const heroLabel = document.createElement("label");
    heroLabel.style.display = "flex";
    heroLabel.style.alignItems = "center";
    heroLabel.style.gap = "8px";
    heroLabel.style.color = "white";
    heroLabel.style.fontSize = "14px";
    heroLabel.style.cursor = "pointer";

    const heroCheckbox = document.createElement("input");
    heroCheckbox.type = "checkbox";
    heroCheckbox.checked = currentHero === imgData.imageUrl;

    heroCheckbox.addEventListener("change", () => {
      if (heroCheckbox.checked) {
        localStorage.setItem("heroImage", imgData.imageUrl);
      } else {
        localStorage.removeItem("heroImage");
      }
      renderAdminGallery();
    });

    heroLabel.appendChild(heroCheckbox);
    heroLabel.appendChild(document.createTextNode("Set as Hero"));

    const featuredLabel = document.createElement("label");
    featuredLabel.style.display = "flex";
    featuredLabel.style.alignItems = "center";
    featuredLabel.style.gap = "8px";
    featuredLabel.style.color = "white";
    featuredLabel.style.fontSize = "14px";
    featuredLabel.style.cursor = "pointer";

    const featuredCheckbox = document.createElement("input");
    featuredCheckbox.type = "checkbox";
    featuredCheckbox.checked = !!imgData.featured;

    featuredCheckbox.addEventListener("change", () => {
      const updatedImages = getSavedImages();

      if (featuredCheckbox.checked) {
        const featuredCount = updatedImages.filter((img) => img.featured).length;

        if (featuredCount >= 6 && !updatedImages[index].featured) {
          alert("You can only have up to 6 featured images on the homepage.");
          renderAdminGallery();
          return;
        }
      }

      updatedImages[index].featured = featuredCheckbox.checked;
      saveImages(updatedImages);
      renderAdminGallery();
    });

    featuredLabel.appendChild(featuredCheckbox);
    featuredLabel.appendChild(document.createTextNode("Featured on Homepage"));

    const categoriesBox = document.createElement("div");
    categoriesBox.style.marginTop = "6px";
    categoriesBox.style.padding = "8px";
    categoriesBox.style.border = "1px solid #333";
    categoriesBox.style.borderRadius = "8px";

    const categoriesTitle = document.createElement("p");
    categoriesTitle.textContent = "Edit Categories";
    categoriesTitle.style.marginBottom = "8px";
    categoriesTitle.style.color = "#ccc";
    categoriesTitle.style.fontSize = "14px";

    categoriesBox.appendChild(categoriesTitle);

    allCategories.forEach((categoryName) => {
      const catLabel = document.createElement("label");
      catLabel.style.display = "flex";
      catLabel.style.alignItems = "center";
      catLabel.style.gap = "8px";
      catLabel.style.color = "white";
      catLabel.style.fontSize = "14px";
      catLabel.style.cursor = "pointer";
      catLabel.style.marginBottom = "4px";

      const catCheckbox = document.createElement("input");
      catCheckbox.type = "checkbox";
      catCheckbox.checked = currentCategories.includes(categoryName);

      catCheckbox.addEventListener("change", () => {
        const updatedImages = getSavedImages();
        const image = updatedImages[index];

        let imageCategories = Array.isArray(image.categories)
          ? [...image.categories]
          : image.category
          ? [image.category]
          : [];

        if (catCheckbox.checked) {
          if (!imageCategories.includes(categoryName)) {
            imageCategories.push(categoryName);
          }
        } else {
          imageCategories = imageCategories.filter((cat) => cat !== categoryName);
        }

        if (imageCategories.length === 0) {
          alert("Each image must have at least one category.");
          renderAdminGallery();
          return;
        }

        image.categories = imageCategories;
        delete image.category;

        saveImages(updatedImages);
        renderAdminGallery();
      });

      catLabel.appendChild(catCheckbox);
      catLabel.appendChild(
        document.createTextNode(
          categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
        )
      );

      categoriesBox.appendChild(catLabel);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.padding = "10px 12px";
    deleteBtn.style.border = "1px solid white";
    deleteBtn.style.background = "rgba(0, 0, 0, 0.75)";
    deleteBtn.style.color = "white";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.borderRadius = "6px";
    deleteBtn.style.marginTop = "4px";

    deleteBtn.addEventListener("click", () => {
      deleteImage(index);
    });

    controls.appendChild(heroLabel);
    controls.appendChild(featuredLabel);
    controls.appendChild(categoriesBox);
    controls.appendChild(deleteBtn);

    wrapper.appendChild(img);
    wrapper.appendChild(title);
    wrapper.appendChild(categoryText);
    wrapper.appendChild(controls);

    container.appendChild(wrapper);
  });
}

function deleteImage(index) {
  const images = getSavedImages();
  const currentHero = localStorage.getItem("heroImage");

  if (images[index] && images[index].imageUrl === currentHero) {
    localStorage.removeItem("heroImage");
  }

  images.splice(index, 1);
  saveImages(images);
  renderAdminGallery();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");

  renderAdminGallery();

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageInput = document.getElementById("image");
    const title = document.getElementById("title").value.trim();
    const categoryInputs = document.querySelectorAll('input[name="categories"]:checked');
    const categories = Array.from(categoryInputs).map((input) =>
      input.value.trim().toLowerCase()
  );
    const featured = document.getElementById("featured").checked;
    const hero = document.getElementById("hero").checked;

    if (!imageInput.files[0]) {
      alert("Please select an image.");
      return;
    }

    if (!title) {
      alert("Please enter an image title.");
      return;
    }

    if (categories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    try {
      const originalFile = imageInput.files[0];
      const imageFile = await compressImage(originalFile);

      console.log(
        "Original size:",
        originalFile.size,
        "Compressed size:",
        imageFile.size
      );

      const formData = new FormData();
      formData.append("file", imageFile, "upload.jpg");
      formData.append("upload_preset", "through_the_lens_unsigned");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dsrxgoidp/image/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary error:", data);
        alert(`Upload failed: ${data.error?.message || "Unknown error"}`);
        return;
      }

      let savedImages = getSavedImages();

      if (featured) {
        const featuredCount = savedImages.filter((img) => img.featured).length;
        if (featuredCount >= 6) {
          alert("You can only have up to 6 featured images on the homepage.");
          return;
        }
      }

      const newImageData = {
        id: Date.now().toString(),
        title: title,
        imageUrl: data.secure_url,
        publicId: data.public_id,
        category: categories,
        featured: featured,
        hero: hero
      };

      if (hero) {
        localStorage.setItem("heroImage", newImageData.imageUrl);
      }

      savedImages.push(newImageData);
      saveImages(savedImages);

      renderAdminGallery();
      form.reset();

      alert("Image uploaded successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during upload.");
    }
  });
});