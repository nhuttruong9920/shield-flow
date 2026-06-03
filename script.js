window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        line: "#d7dee8",
        night: "#0d1117",
        panel: "#151b23",
        accent: "#0ea5a4",
        amberline: "#f2b84b"
      },
      boxShadow: {
        soft: "0 18px 42px rgba(15, 23, 42, 0.12)"
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuButton = document.getElementById("menuButton");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const navLinks = document.querySelectorAll(".nav-link");

  function setThemeIcon() {
    const isDark = html.classList.contains("dark");
    themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  function applySavedTheme() {
    const saved = localStorage.getItem("shield-flow-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    html.classList.toggle("dark", saved ? saved === "dark" : prefersDark);
    setThemeIcon();
  }

  function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }

  function setActiveLink() {
    const sections = [
      ...document.querySelectorAll("main section[id], main [data-nav-section]")
    ];
    const current = sections.reduce((active, section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 120 ? section.id : active;
    }, sections[0].id);

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", isActive);
    });
  }

  applySavedTheme();
  setActiveLink();

  themeToggle.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem("shield-flow-theme", html.classList.contains("dark") ? "dark" : "light");
    setThemeIcon();
  });

  menuButton.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);
  navLinks.forEach((link) => link.addEventListener("click", closeSidebar));
  window.addEventListener("scroll", setActiveLink, { passive: true });
});
