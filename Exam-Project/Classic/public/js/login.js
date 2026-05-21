function showError(msg) {
  const el = document.getElementById("error-msg");
  el.textContent = msg;
  el.style.visibility = "visible";
}

function clearError() {
  const el = document.getElementById("error-msg");
  el.style.visibility = "hidden";
  el.textContent = " ";
}

function quickLogin(email, password) {
  document.getElementById("email").value = email;
  document.getElementById("password").value = password;
  clearError();
}

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearError();

  const btn = this.querySelector(".submit-btn");
  btn.disabled = true;
  btn.textContent = "Signing in…";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/admin";
    } else {
      showError(data.message || "Incorrect email or password.");
      btn.disabled = false;
      btn.textContent = "Sign in";
    }
  } catch (err) {
    showError("Network error — please try again.");
    btn.disabled = false;
    btn.textContent = "Sign in";
  }
});
