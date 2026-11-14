const root = document.documentElement;
const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const header = document.querySelector(".site-header");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];

function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === "dark";
  themeIcon.src = dark ? "assets/icons/sun.svg" : "assets/icons/moon.svg";
  themeToggle.setAttribute("aria-label", dark ? "تغییر به حالت روشن" : "تغییر به حالت تاریک");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = dark ? "#101a25" : "#f4f5f6";
}

applyTheme(root.dataset.theme || "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem("avand-theme", nextTheme);
  } catch (error) {
    applyTheme(nextTheme);
  }
});

function closeMenu(returnFocus = false) {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "باز کردن منو");
  body.classList.remove("menu-open");
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMenu();
  } else {
    navigation.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "بستن منو");
    body.classList.add("menu-open");
    navigation.querySelector("a")?.focus();
  }
});

navLinks.forEach(link => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") closeMenu(true);
});

document.addEventListener("click", event => {
  if (menuToggle.getAttribute("aria-expanded") !== "true") return;
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
} else {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("is-visible"));
}

const yearElement = document.getElementById("current-year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

window.addEventListener("resize", () => {
  if (window.innerWidth > 820 && menuToggle.getAttribute("aria-expanded") === "true") closeMenu();
});
