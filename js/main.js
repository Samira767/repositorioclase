/* ==========================================================================
   MAIN.JS — Interacciones generales del sitio
   - Menú móvil (hamburguesa)
   - Sombra del header al hacer scroll
   - Año dinámico en el footer
   - Paneles laterales (carrito, favoritos, cuenta, búsqueda)
   - Avisos flotantes (toast)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  setCurrentYear();
  initPanels();
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

/* --------------------------------------------------------------------------
   PANELES LATERALES
   Cualquier botón con data-open-panel="id-del-panel" abre ese panel.
   Cualquier elemento con data-close-panel cierra el panel abierto.
   Desde otros scripts: abrirPanel("cart-drawer") / cerrarPanel()
   -------------------------------------------------------------------------- */
let panelAbierto = null;
let focoAnterior = null;

function abrirPanel(id) {
  const panel = document.getElementById(id);
  const overlay = document.getElementById("panel-overlay");
  if (!panel) return;

  if (panelAbierto) cerrarPanel({ devolverFoco: false });
  else focoAnterior = document.activeElement;

  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  if (overlay) overlay.hidden = false;
  document.body.classList.add("is-locked");
  panelAbierto = panel;

  // Avisa al panel que se abrió (para refrescar su contenido)
  panel.dispatchEvent(new CustomEvent("panel:open"));

  const foco = panel.querySelector("[data-autofocus]") || panel.querySelector("[data-close-panel]");
  setTimeout(() => foco?.focus(), 50);
}

function cerrarPanel({ devolverFoco = true } = {}) {
  const overlay = document.getElementById("panel-overlay");
  if (!panelAbierto) return;

  panelAbierto.classList.remove("is-open");
  panelAbierto.setAttribute("aria-hidden", "true");
  if (overlay) overlay.hidden = true;
  document.body.classList.remove("is-locked");
  panelAbierto = null;

  if (devolverFoco) focoAnterior?.focus();
}

function initPanels() {
  const overlay = document.getElementById("panel-overlay");

  document.addEventListener("click", (event) => {
    const botonAbrir = event.target.closest("[data-open-panel]");
    if (botonAbrir) {
      event.preventDefault();
      abrirPanel(botonAbrir.dataset.openPanel);
      return;
    }

    if (event.target.closest("[data-close-panel]")) cerrarPanel();
  });

  overlay?.addEventListener("click", () => cerrarPanel());

  // Escape cierra el panel (si hay un modal encima, se cierra primero el modal)
  document.addEventListener("keydown", (event) => {
    const hayModal = document.querySelector(".modal:not([hidden])");
    if (event.key === "Escape" && panelAbierto && !hayModal) cerrarPanel();
  });
}

/* --------------------------------------------------------------------------
   AVISO FLOTANTE (toast)
   Uso desde cualquier script: mostrarAviso("Producto agregado")
   -------------------------------------------------------------------------- */
let temporizadorAviso;

function mostrarAviso(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = mensaje;
  toast.classList.add("is-visible");

  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}
