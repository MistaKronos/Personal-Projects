document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the admin products page or admin home
        window.location.href = "/admin";
      } else {
        // Handle login failure
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed due to a network error.");
    }
  });
