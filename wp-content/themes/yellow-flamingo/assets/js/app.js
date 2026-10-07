document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("primary-menu");
  const toggle = document.getElementById("menu-toggle");

  if (!menu || !toggle) return;

  const closeButtons = menu.querySelectorAll("[data-menu-close]");
  const firstLink = menu.querySelector("nav a");

  let isOpen = false;

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    menu.classList.remove("pointer-events-none", "opacity-0");
    menu.removeAttribute("inert");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden");
    firstLink?.focus();
  };

  const closeMenu = () => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.add("pointer-events-none", "opacity-0");
    menu.setAttribute("inert", "");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
    toggle.focus();
  };

  toggle.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});
