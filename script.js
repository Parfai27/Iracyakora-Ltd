(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var menuToggle = document.querySelector(".menu-toggle");
  var siteNav = document.querySelector(".site-nav");
  var currentYear = document.querySelector("#current-year");
  var topbar = document.querySelector(".topbar");

  function storedTheme() {
    try { return localStorage.getItem("iracyakora-theme"); } catch (error) { return null; }
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeButton) {
      themeButton.textContent = theme === "dark" ? "Light" : "Dark";
      themeButton.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    }
    try { localStorage.setItem("iracyakora-theme", theme); } catch (error) { /* Storage may be unavailable. */ }
  }

  var initialTheme = storedTheme();
  if (!initialTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) initialTheme = "dark";
  setTheme(initialTheme || "light");

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  var skipLink = document.createElement("a");
  skipLink.className = "skip-link";
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  body.insertBefore(skipLink, body.firstChild);
  var main = document.querySelector("main");
  if (main) main.id = "main-content";

  var themeButton = document.createElement("button");
  themeButton.className = "theme-toggle";
  themeButton.type = "button";
  themeButton.textContent = root.getAttribute("data-theme") === "dark" ? "Light" : "Dark";
  themeButton.setAttribute("aria-label", "Switch color theme");
  if (topbar) topbar.insertBefore(themeButton, menuToggle || siteNav);
  themeButton.addEventListener("click", function () {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  function closeMenu() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });
    siteNav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeMenu(); });
    document.addEventListener("click", function (event) {
      if (siteNav.classList.contains("is-open") && !siteNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  function categoryFor(title) {
    var value = title.toLowerCase();
    if (/door|ironmongery/.test(value)) return "doors";
    if (/cabinet|furniture/.test(value)) return "interiors";
    if (/glass|partition/.test(value)) return "glass";
    if (/security|safety/.test(value)) return "security";
    return "essentials";
  }

  var productGrid = document.querySelector(".product-grid");
  if (productGrid && /\/products\/?$/.test(window.location.pathname)) {
    var cards = Array.prototype.slice.call(productGrid.querySelectorAll(".product-card"));
    var toolbar = document.createElement("div");
    toolbar.className = "catalogue-toolbar";
    toolbar.innerHTML = '<label class="catalogue-search"><span>Search products</span><input type="search" placeholder="Search locks, hinges, fittings…" aria-label="Search product categories"></label><div class="catalogue-filters" role="group" aria-label="Filter product categories"><button class="is-active" data-category="all">All</button><button data-category="doors">Doors</button><button data-category="interiors">Interiors</button><button data-category="glass">Glass</button><button data-category="security">Security</button></div><p class="catalogue-count" aria-live="polite"></p>';
    productGrid.parentNode.insertBefore(toolbar, productGrid);
    cards.forEach(function (card) { card.setAttribute("data-category", categoryFor(card.querySelector("h3").textContent)); });
    var query = toolbar.querySelector("input");
    var filters = Array.prototype.slice.call(toolbar.querySelectorAll("button"));
    var count = toolbar.querySelector(".catalogue-count");
    var activeCategory = "all";
    function filterProducts() {
      var term = query.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var matchesCategory = activeCategory === "all" || card.getAttribute("data-category") === activeCategory;
        var matchesTerm = !term || card.textContent.toLowerCase().indexOf(term) !== -1;
        var show = matchesCategory && matchesTerm;
        card.hidden = !show;
        if (show) visible += 1;
      });
      count.textContent = visible + (visible === 1 ? " category shown" : " categories shown");
    }
    query.addEventListener("input", filterProducts);
    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-category");
        filters.forEach(function (item) { item.classList.toggle("is-active", item === button); });
        filterProducts();
      });
    });
    filterProducts();
  }

  var revealItems = document.querySelectorAll(".section, .hero, .footer");
  revealItems.forEach(function (item) { item.classList.add("reveal"); });
  if ("IntersectionObserver" in window && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }
}());
