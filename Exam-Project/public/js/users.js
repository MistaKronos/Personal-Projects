function makeAdmin(userId) {
  const adminRoleId = 2; // 2 Is the admin role
  fetch(`/admin/users/${userId}/changerole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roleId: adminRoleId }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        } else if (response.status === 401) {
          throw new Error("Unauthorized access");
        } else {
          throw new Error("Failed to change user role");
        }
      }
      return response.json();
    })
    .then((data) => {
      console.log("User role updated:", data);
      alert("User role updated successfully.");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message); // Displays error directly to front-end
    });
}
