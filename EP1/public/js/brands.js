// Function to handle adding a new brand
function addBrand(event) {
  event.preventDefault();
  const name = document.getElementById("brand-name").value;

  if (!name.trim()) {
    alert("Brand name cannot be empty.");
    return;
  }

  fetch("/brands", {
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
      console.log("Brand added:", data.brand);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding brand:", error);
      alert("Failed to add brand. Please try again.");
    });
}

// Function to handle editing a brand
function editBrand(brandId) {
  // Fetch the brand data and populate the form fields
  fetch(`/brands/${brandId}`)
    .then((response) => response.json())
    .then((brand) => {
      document.getElementById("edit-brand-id").value = brand.id;
      document.getElementById("edit-brand-name").value = brand.name;
      $("#editBrandModal").modal("show");
    })
    .catch((error) => console.error("Error loading brand:", error));
}

// Function to handle updating a brand
function updateBrand(event) {
  event.preventDefault();
  const brandId = document.getElementById("edit-brand-id").value;
  const name = document.getElementById("edit-brand-name").value;

  if (!name.trim()) {
    alert("Brand name cannot be empty.");
    return;
  }

  fetch(`/brands/${brandId}`, {
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
      console.log("Brand updated:", data.brand);
      $("#editBrandModal").modal("hide");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating brand:", error);
      alert("Failed to update brand. Please try again.");
    });
}

// Function to handle deleting a brand
function deleteBrand(brandId) {
  if (!confirm("Are you sure you want to delete this brand?")) {
    return;
  }

  fetch(`/brands/${brandId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Brand deleted successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting brand:", error);
      alert(
        "Failed to delete brand. Please ensure it's not associated with any products."
      );
    });
}
