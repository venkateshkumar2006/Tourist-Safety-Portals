document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const message = document.getElementById("message");

  // --- Registration ---
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const user = {
        name: document.getElementById("reg-name").value,
        age: document.getElementById("reg-age").value,
        gender: document.getElementById("reg-gender").value,
        mobile: document.getElementById("reg-mobile").value,
        lang: document.getElementById("reg-lang").value,
        email: document.getElementById("reg-email").value,
        password: document.getElementById("reg-password").value,
      };

      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      message.textContent = data.message;
    });
  }

  // --- Login ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const creds = {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
      };
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.location.href =
          data.user.role === "admin" ? "admin-portal.html" : "user-portal.html";
      } else {
        message.textContent = data.message;
      }
    });
  }

  // --- User Portal Menu ---
  window.openPage = function (page) {
    const container = document.getElementById("page-content");
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (page === "home") {
      container.innerHTML = `<h2>Profile</h2>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Mobile: ${user.mobile}</p>`;
    }
    if (page === "blockchain") {
      container.innerHTML = `<h2>Blockchain e-KYC</h2><p>Mock KYC details for ${user.name}</p>`;
    }
    if (page === "sos") {
      container.innerHTML = `<button onclick="sendSOS()">🚨 Send SOS</button>`;
    }
    if (page === "medical") {
      container.innerHTML = `<h2>Medical Help</h2><button onclick="requestMedical()">Request Help</button>`;
    }
    if (page === "geo") {
      container.innerHTML = `<h2>Geo-fencing</h2><iframe width="100%" height="300" src="https://maps.google.com/maps?q=India&z=6&output=embed"></iframe>`;
    }
    if (page === "incident") {
      container.innerHTML = `<h2>Incident Report</h2>
        <textarea id="incident-text"></textarea><br/>
        <button onclick="submitIncident()">Submit</button>`;
    }
    if (page === "disaster") {
      container.innerHTML = `<h2>Disaster Alerts</h2><p>Restricted. Only Admin can view.</p>`;
    }
  };

  window.logout = function () {
    sessionStorage.clear();
    window.location.href = "index.html";
  };

  window.sendSOS = async function () {
    const user = JSON.parse(sessionStorage.getItem("user"));
    await fetch("/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    });
    alert("SOS Sent!");
  };

  window.requestMedical = async function () {
    const user = JSON.parse(sessionStorage.getItem("user"));
    await fetch("/medical", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    });
    alert("Medical request sent!");
  };

  window.submitIncident = async function () {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const text = document.getElementById("incident-text").value;
    await fetch("/incident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, text }),
    });
    alert("Incident reported!");
  };
});
// ================= Admin Portal Functions =================
window.loadUsers = async function () {
  const res = await fetch("/admin/users");
  const data = await res.json();
  const content = document.getElementById("admin-content");
  content.innerHTML = "<h2>All Users</h2><ul>" + 
    data.map(u => `<li>${u.id} - ${u.name} (${u.email})</li>`).join("") +
    "</ul>";
};

window.loadSOS = async function () {
  const res = await fetch("/admin/sos");
  const data = await res.json();
  const content = document.getElementById("admin-content");
  content.innerHTML = "<h2>SOS Alerts</h2><ul>" +
    data.map(s => `<li>User ${s.userId} at ${new Date(s.time).toLocaleString()}</li>`).join("") +
    "</ul>";
};

window.loadMedical = async function () {
  const res = await fetch("/admin/medical");
  const data = await res.json();
  const content = document.getElementById("admin-content");
  content.innerHTML = "<h2>Medical Requests</h2><ul>" +
    data.map(m => `<li>User ${m.userId} at ${new Date(m.time).toLocaleString()}</li>`).join("") +
    "</ul>";
};

window.loadIncidents = async function () {
  const res = await fetch("/admin/incidents");
  const data = await res.json();
  const content = document.getElementById("admin-content");
  content.innerHTML = "<h2>Incident Reports</h2><ul>" +
    data.map(i => `<li>User ${i.userId}: ${i.text} (${new Date(i.time).toLocaleString()})</li>`).join("") +
    "</ul>";
};
