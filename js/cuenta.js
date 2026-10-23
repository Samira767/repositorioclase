/* ==========================================================================
   CUENTA.JS — Inicio de sesión y registro (simulado)
   IMPORTANTE: es solo una demo para el proyecto. Los usuarios se guardan en
   localStorage del navegador; una tienda real usaría un servidor seguro.
   ========================================================================== */

const CLAVE_USUARIOS = "usuarios_aeris";
const CLAVE_SESION = "sesion_aeris";

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

// Devuelve { nombre, email } del usuario con sesión iniciada, o null
function obtenerUsuarioActual() {
  const email = localStorage.getItem(CLAVE_SESION);
  if (!email) return null;
  return obtenerUsuarios().find((usuario) => usuario.email === email) || null;
}

function iniciarSesion(email) {
  localStorage.setItem(CLAVE_SESION, email);
  renderizarCuenta();
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  mostrarPestana("login");
  renderizarCuenta();
  mostrarAviso("Cerraste sesión");
}

/* --------------------------------------------------------------------------
   VISTA DEL PANEL (invitado / usuario)
   -------------------------------------------------------------------------- */
function renderizarCuenta() {
  const usuario = obtenerUsuarioActual();
  const vistaInvitado = document.getElementById("account-guest");
  const vistaUsuario = document.getElementById("account-user");
  const iconoCuenta = document.querySelector('[data-action="user"]');

  if (vistaInvitado) vistaInvitado.hidden = Boolean(usuario);
  if (vistaUsuario) vistaUsuario.hidden = !usuario;

  if (usuario) {
    document.getElementById("account-name").textContent = usuario.nombre;
    document.getElementById("account-email").textContent = usuario.email;
    document.getElementById("account-avatar").textContent = usuario.nombre.charAt(0).toUpperCase();
  }

  // Puntito en el icono del header cuando hay sesión
  if (iconoCuenta) {
    iconoCuenta.classList.toggle("is-logged-in", Boolean(usuario));
    iconoCuenta.setAttribute("aria-label", usuario ? `Mi cuenta (${usuario.nombre})` : "Mi cuenta");
  }
}

function mostrarPestana(nombre) {
  document.querySelectorAll("[data-account-tab]").forEach((tab) => {
    const activa = tab.dataset.accountTab === nombre;
    tab.classList.toggle("is-active", activa);
    tab.setAttribute("aria-selected", String(activa));
  });
  document.getElementById("login-form").hidden = nombre !== "login";
  document.getElementById("register-form").hidden = nombre !== "registro";
}

function mostrarError(formulario, mensaje) {
  const error = formulario.querySelector(".form__error");
  error.textContent = mensaje;
  error.hidden = !mensaje;
}

/* --------------------------------------------------------------------------
   EVENTOS
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("login-form");
  const formRegistro = document.getElementById("register-form");
  if (!formLogin || !formRegistro) return;

  renderizarCuenta();

  // Pestañas "Iniciar sesión" / "Crear cuenta"
  document.querySelectorAll("[data-account-tab]").forEach((tab) => {
    tab.addEventListener("click", () => mostrarPestana(tab.dataset.accountTab));
  });

  // Iniciar sesión
  formLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = formLogin.email.value.trim().toLowerCase();
    const password = formLogin.password.value;

    const usuario = obtenerUsuarios().find((u) => u.email === email);
    if (!usuario || usuario.password !== password) {
      mostrarError(formLogin, "Correo o contraseña incorrectos.");
      return;
    }

    mostrarError(formLogin, "");
    formLogin.reset();
    iniciarSesion(email);
    mostrarAviso(`¡Hola de nuevo, ${usuario.nombre}!`);
  });

  // Crear cuenta
  formRegistro.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = formRegistro.nombre.value.trim();
    const email = formRegistro.email.value.trim().toLowerCase();
    const password = formRegistro.password.value;
    const usuarios = obtenerUsuarios();

    if (password.length < 6) {
      mostrarError(formRegistro, "La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (usuarios.some((u) => u.email === email)) {
      mostrarError(formRegistro, "Ya existe una cuenta con ese correo.");
      return;
    }

    usuarios.push({ nombre, email, password });
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));

    mostrarError(formRegistro, "");
    formRegistro.reset();
    iniciarSesion(email);
    mostrarAviso(`¡Te damos la bienvenida, ${nombre}!`);
  });

  document.getElementById("logout-btn")?.addEventListener("click", cerrarSesion);
});
