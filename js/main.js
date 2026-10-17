/* ==========================================================================
   MAIN.JS — Interacciones generales del sitio
   - Menú móvil (hamburguesa)
   - Sombra del header al hacer scroll
   - Año dinámico en el footer
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   MENÚ MÓVIL
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  const overlay = document.getElementById("nav-overlay");
  const desktopQuery = window.matchMedia("(min-width: 961px)");

  if (!toggle || !nav || !overlay) return;

  const isOpen = () => nav.classList.contains("is-open");

  function openMenu() {
    nav.classList.add("is-open");
    overlay.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    document.body.classList.add("is-locked");
    nav.querySelector(".nav__link")?.focus();
  }

  function closeMenu({ returnFocus = false } = {}) {
    nav.classList.remove("is-open");
    overlay.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("is-locked");
    if (returnFocus) toggle.focus();
  }

  // Abrir / cerrar con el botón
  toggle.addEventListener("click", () => {
    isOpen() ? closeMenu() : openMenu();
  });

  // Cerrar al hacer clic en el fondo oscuro
  overlay.addEventListener("click", () => closeMenu());

  // Cerrar al elegir un enlace
  nav.addEventListener("click", (event) => {
    if (event.target.closest(".nav__link")) closeMenu();
  });

  // Cerrar con la tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) closeMenu({ returnFocus: true });
  });

  // Si se agranda la pantalla a escritorio, resetear el estado
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && isOpen()) closeMenu();
  });
}

/* --------------------------------------------------------------------------
   HEADER CON SOMBRA AL HACER SCROLL
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   AÑO ACTUAL EN EL FOOTER
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}
