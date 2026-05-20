document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("search-button")
    .addEventListener("click", searchProduct);
  document
    .getElementById("clear-button")
    .addEventListener("click", clearSearch);
});

function addProduct(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const quantity = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const brandId = document.getElementById("brandId").value;
  const categoryId = document.getElementById("categoryId").value;

  const productData = {
    name,
    description,
    quantity: parseInt(quantity, 10),
    price: parseFloat(price),
    imageUrl,
    brandId: parseInt(brandId, 10),
    categoryId: parseInt(categoryId, 10),
  };

  fetch("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Product added:", data.product);
      document.getElementById("add-product-form").reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please check your input and try again.");
    });
}

function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  fetch(`/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Product deleted successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    });
}

function editProduct(productId) {
  fetch(`/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      // Populate the edit form fields with product data
      document.getElementById("edit-name").value = product.name;
      document.getElementById("edit-description").value = product.description;
      document.getElementById("edit-quantity").value = product.quantity;
      document.getElementById("edit-price").value = product.price;
      document.getElementById("edit-imageUrl").value = product.imageUrl;
      document.getElementById("edit-brandId").value = product.brandId;
      document.getElementById("edit-categoryId").value = product.categoryId;
      document.getElementById("edit-isDeleted").checked = product.isDeleted;

      // Store the current productId
      document.getElementById("edit-product-id").value = productId;

      // Show the modal
      $("#editProductModal").modal("show");
    })
    .catch((error) => console.error("Error:", error));
}

function updateProduct(event) {
  event.preventDefault();

  const productId = document.getElementById("edit-product-id").value;
  const updatedName = document.getElementById("edit-name").value;
  const updatedDescription = document.getElementById("edit-description").value;
  const updatedQuantity = document.getElementById("edit-quantity").value;
  const updatedPrice = document.getElementById("edit-price").value;
  const updatedImageUrl = document.getElementById("edit-imageUrl").value;
  const updatedBrandId = document.getElementById("edit-brandId").value;
  const updatedCategoryId = document.getElementById("edit-categoryId").value;
  const isDeletedCheckbox = document.getElementById("edit-isDeleted");
  const isDeleted = isDeletedCheckbox ? isDeletedCheckbox.checked : false;

  const updatedProductData = {
    name: updatedName,
    description: updatedDescription,
    quantity: parseInt(updatedQuantity, 10),
    price: parseFloat(updatedPrice),
    imageUrl: updatedImageUrl,
    brandId: parseInt(updatedBrandId, 10),
    categoryId: parseInt(updatedCategoryId, 10),
    isDeleted: isDeleted,
  };

  fetch(`/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProductData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Product updated:", data.product);
      $("#editProductModal").modal("hide");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please check your input and try again.");
    });
}

function updateProductTable(products) {
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = ""; // Clear the table body
  products.forEach((product) => {
    const dateAdded = product.dateAdded
      ? new Date(product.dateAdded).toLocaleDateString()
      : "Unknown";
    const brandName = product.brandName || "Unknown";
    const categoryName = product.categoryName || "Unknown";

    // Create a new row and cells with the product data
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.description}</td>
      <td>${product.quantity}</td>
      <td>${product.price}</td>
      <td>${brandName}</td>
      <td>${categoryName}</td>
      <td><img src="${product.imageUrl}" alt="${product.name}" height="50"></td>
      <td>${product.isDeleted ? "Yes" : "No"}</td>
      <td>${dateAdded}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="editProduct(${
          product.id
        })">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${
          product.id
        })">Delete</button>
      </td>
    `;
  });
}

function searchProduct(event) {
  event.preventDefault();
  const name = document.getElementById("search-name").value;
  const category = document.getElementById("search-category").value;
  const brand = document.getElementById("search-brand").value;

  fetch("/products/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productName: name,
      categoryName: category,
      brandName: brand,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Search response data:", data);
      updateProductTable(data.products);
    })
    .catch((error) => console.error("Search error:", error));
}

function clearSearch() {
  // Clear the search fields
  document.getElementById("search-name").value = "";
  document.getElementById("search-category").value = "";
  document.getElementById("search-brand").value = "";

  // Reload the products to reset the search condition
  window.location.reload();
}
