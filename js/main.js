// Highlight active nav link
(function () {
  const path = window.location.pathname.replace(/\/$/, "") || "/index.html";
  document.querySelectorAll("nav a").forEach(function (a) {
    const href = a.getAttribute("href").replace(/\/$/, "") || "/index.html";
    if (path.endsWith(href)) a.classList.add("active");
  });
})();

// Generic fetch helper
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load " + url);
  return res.json();
}

// ── Home page ──────────────────────────────────────────
async function loadHome() {
  const el = document.getElementById("home-content");
  if (!el) return;
  try {
    const data = await fetchJSON("/content/home.json");
    document.querySelector(".hero h2").textContent = data.title || "Welcome";
    document.querySelector(".hero p").textContent = data.welcome_text || "";
  } catch (e) {
    el.innerHTML = '<p class="error">Could not load content.</p>';
  }
}

// ── Rams page ──────────────────────────────────────────
async function loadRams() {
  const container = document.getElementById("rams-container");
  if (!container) return;
  container.innerHTML = '<p class="loading">Loading rams\u2026</p>';
  try {
    const data = await fetchJSON("/content/rams.json");
    const rams = data.rams || [];
    if (!rams.length) {
      container.innerHTML = "<p>No rams currently listed.</p>";
      return;
    }
    container.innerHTML = "";
    container.className = "cards";
    rams.forEach(function (ram) {
      const card = document.createElement("div");
      card.className = "card";
      const imgHtml = ram.photo
        ? '<img src="' + escHtml(ram.photo) + '" alt="' + escHtml(ram.name) + '">'
        : '<div class="card-placeholder">🐑</div>';
      card.innerHTML =
        imgHtml +
        '<div class="card-body">' +
        "<h3>" + escHtml(ram.name) + "</h3>" +
        '<span class="breed">' + escHtml(ram.breed) + "</span>" +
        '<span class="price">&pound;' + Number(ram.price).toLocaleString() + "</span>" +
        "<p>" + escHtml(ram.description) + "</p>" +
        "</div>";
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = '<p class="error">Could not load rams listing.</p>';
  }
}

// ── News page ──────────────────────────────────────────
async function loadNews() {
  const container = document.getElementById("news-container");
  if (!container) return;
  container.innerHTML = '<p class="loading">Loading news\u2026</p>';
  try {
    const data = await fetchJSON("/content/news.json");
    const posts = data.posts || [];
    if (!posts.length) {
      container.innerHTML = "<p>No news posts yet.</p>";
      return;
    }
    container.innerHTML = "";
    container.className = "news-list";
    posts.forEach(function (post) {
      const item = document.createElement("div");
      item.className = "news-item";
      const imgHtml = post.photo
        ? '<img src="' + escHtml(post.photo) + '" alt="' + escHtml(post.title) + '">'
        : "";
      const dateStr = post.date ? new Date(post.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "";
      item.innerHTML =
        imgHtml +
        '<div class="news-body">' +
        "<h3>" + escHtml(post.title) + "</h3>" +
        (dateStr ? '<p class="date">' + dateStr + "</p>" : "") +
        "<p>" + escHtml(post.content) + "</p>" +
        "</div>";
      container.appendChild(item);
    });
  } catch (e) {
    container.innerHTML = '<p class="error">Could not load news.</p>';
  }
}

// ── Contact form ───────────────────────────────────────
function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.textContent = "Sent!";
    btn.disabled = true;
    form.reset();
    setTimeout(function () {
      btn.textContent = "Send Message";
      btn.disabled = false;
    }, 3000);
  });
}

// ── Utility ────────────────────────────────────────────
function escHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Boot ───────────────────────────────────────────────
loadHome();
loadRams();
loadNews();
initContact();
