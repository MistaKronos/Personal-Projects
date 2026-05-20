// Function to handle adding a new category
function addCategory(event) {
  event.preventDefault();
  const name = document.getElementById("category-name").value;

  if (!name.trim()) {
    alert("Category name cannot be empty.");
    return;
  }

  fetch("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Category added:", data.category);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    });
}

// Function to handle editing a category
function editCategory(categoryId) {
  // Fetch the category data and populate the form fields
  fetch(`/categories/${categoryId}`)
    .then((response) => response.json())
    .then((category) => {
      document.getElementById("edit-category-id").value = category.id;
      document.getElementById("edit-category-name").value = category.name;
      $("#editCategoryModal").modal("show");
    })
    .catch((error) => console.error("Error loading category:", error));
}

// Function to handle updating a category
function updateCategory(event) {
  event.preventDefault();
  const categoryId = document.getElementById("edit-category-id").value;
  const name = document.getElementById("edit-category-name").value;

  if (!name.trim()) {
    alert("Category name cannot be empty.");
    return;
  }

  fetch(`/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Category updated:", data.category);
      $("#editCategoryModal").modal("hide");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    });
}

// Function to handle deleting a category
function deleteCategory(categoryId) {
  if (!confirm("Are you sure you want to delete this category?")) {
    return;
  }

  fetch(`/categories/${categoryId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Category deleted successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting category:", error);
      alert(
        "Failed to delete category. Please ensure it's not associated with any products."
      );
    });
}
