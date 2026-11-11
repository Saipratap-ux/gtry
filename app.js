/* StudentHub shared application utilities */
(() => {
  const defaults = { tasks: [], plans: [], notes: [], sessions: [], theme: "light" };
  const state = { ...defaults };
  Object.keys(defaults).forEach(key => {
    try {
      const saved = localStorage.getItem(`studenthub_${key}`);
      if (saved !== null) state[key] = key === "theme" ? saved : JSON.parse(saved);
    } catch (error) { console.warn(`Could not load ${key}`, error); }
  });
  window.SH = {
    state,
    save(key) {
      try { localStorage.setItem(`studenthub_${key}`, key === "theme" ? state[key] : JSON.stringify(state[key])); }
      catch (error) { this.toast("Storage is full. Remove some saved items."); }
    },
    id() { return `${Date.now()}_${Math.random().toString(16).slice(2,8)}`; },
    escape(value) {
      return String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[char]));
    },
    date(value, options = { month: "short", day: "numeric" }) {
      if (!value) return "No date";
      const date = new Date(`${value}T12:00:00`);
      return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString(undefined, options);
    },
    toast(message) {
      const el = document.getElementById("toast");
      if (!el) return;
      el.textContent = message; el.classList.add("show");
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
    },
    refresh() {
      ["tasks", "planner", "dashboard", "analytics", "notes", "timer"].forEach(name => {
        const fn = window[`render${name[0].toUpperCase()}${name.slice(1)}`];
        if (typeof fn === "function") fn();
      });
    }
  };

  const pages = ["dashboard", "tasks", "planner", "timer", "notes", "analytics"];
  function showPage(name) {
    if (!pages.includes(name)) name = "dashboard";
    document.querySelectorAll(".page").forEach(page => page.classList.toggle("active", page.id === `page-${name}`));
    document.querySelectorAll(".nav-link[data-page]").forEach(link => link.classList.toggle("active", link.dataset.page === name));
    document.getElementById("pageCrumb").textContent = name === "dashboard" ? "Dashboard" : name[0].toUpperCase() + name.slice(1);
    document.getElementById("sidebar").classList.remove("open");
    history.replaceState(null, "", `#${name}`);
    window.SH.refresh();
  }
  document.querySelectorAll("[data-page]").forEach(link => link.addEventListener("click", () => showPage(link.dataset.page)));
  document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.go)));
  document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
  document.addEventListener("click", event => {
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth <= 760 && sidebar.classList.contains("open") && !sidebar.contains(event.target) && !event.target.closest("#mobileMenu")) sidebar.classList.remove("open");
  });

  function applyTheme() {
    document.body.classList.toggle("dark", state.theme === "dark");
    document.getElementById("themeIcon").textContent = state.theme === "dark" ? "☼" : "☾";
    document.getElementById("topThemeToggle").textContent = state.theme === "dark" ? "☾" : "☼";
  }
  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    SH.save("theme"); applyTheme();
  }
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("topThemeToggle").addEventListener("click", toggleTheme);
  applyTheme();

  const now = new Date();
  document.getElementById("todayLabel").textContent = now.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric" });
  document.getElementById("welcomeDate").textContent = now.toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" }).toUpperCase();
  document.getElementById("year").textContent = now.getFullYear();
  const initialPage = location.hash.slice(1);
  showPage(pages.includes(initialPage) ? initialPage : "dashboard");
})();