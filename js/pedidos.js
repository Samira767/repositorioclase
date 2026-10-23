/* ==========================================================================
   PEDIDOS.JS — "Ver mi pedido" y estado del pedido (simulado)
   - Al finalizar la compra, cart.js llama a registrarPedido(...)
   - Los pedidos se guardan en localStorage por correo del usuario
   - El estado avanza solo con el tiempo para simular el seguimiento
   ========================================================================== */

const CLAVE_PEDIDOS = "pedidos_aeris";

// Etapas del pedido y minutos que deben pasar desde la compra para llegar a cada una
const ESTADOS_PEDIDO = [
  { nombre: "Confirmado", minutos: 0 },
  { nombre: "En preparación", minutos: 1 },
  { nombre: "Enviado", minutos: 3 },
  { nombre: "Entregado", minutos: 6 },
];

function obtenerPedidos() {
  return JSON.parse(localStorage.getItem(CLAVE_PEDIDOS)) || [];
}

function obtenerPedidosDeUsuario(email) {
  return obtenerPedidos()
    .filter((pedido) => pedido.email === email)
    .sort((a, b) => b.fecha - a.fecha);
}

// Guarda un pedido nuevo. productos = copia del carrito al momento de comprar
function registrarPedido(usuario, productos, total) {
  const pedidos = obtenerPedidos();
  const pedido = {
    codigo: `SOV-${Date.now().toString().slice(-6)}`,
    email: usuario.email,
    fecha: Date.now(),
    productos: productos.map(({ nombre, talla, cantidad, precio }) => ({ nombre, talla, cantidad, precio })),
    total,
  };

  pedidos.push(pedido);
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
  return pedido;
}

// Devuelve el índice de la etapa actual según el tiempo transcurrido
function calcularEtapa(pedido) {
  const minutos = (Date.now() - pedido.fecha) / 60000;
  let etapa = 0;
  ESTADOS_PEDIDO.forEach((estado, indice) => {
    if (minutos >= estado.minutos) etapa = indice;
  });
  return etapa;
}

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(fecha);
}

/* --------------------------------------------------------------------------
   VISTA DEL PANEL (aside#orders-drawer)
   -------------------------------------------------------------------------- */
function renderizarPedidos() {
  const contenedor = document.getElementById("orders-items");
  if (!contenedor) return;

  const usuario = typeof obtenerUsuarioActual === "function" ? obtenerUsuarioActual() : null;
  if (!usuario) {
    contenedor.innerHTML = `
      <div class="drawer__empty">
        <p>Inicia sesión para ver tus pedidos.</p>
        <button class="btn btn--outline" type="button" data-open-panel="account-drawer">Iniciar sesión</button>
      </div>`;
    return;
  }

  const pedidos = obtenerPedidosDeUsuario(usuario.email);
  if (pedidos.length === 0) {
    contenedor.innerHTML = `
      <div class="drawer__empty">
        <p>Aún no tienes pedidos.</p>
        <a class="btn btn--outline" href="#catalogo" data-close-panel>Ver colección</a>
      </div>`;
    return;
  }

  contenedor.innerHTML = pedidos.map((pedido) => {
    const etapa = calcularEtapa(pedido);

    const pasos = ESTADOS_PEDIDO.map((estado, indice) => `
      <li class="order__step${indice <= etapa ? " is-done" : ""}${indice === etapa ? " is-current" : ""}">
        ${estado.nombre}
      </li>`).join("");

    const productos = pedido.productos.map((producto) => `
      <li class="order__product">
        <span>${producto.cantidad} × ${producto.nombre} <small>(talla ${producto.talla || "Única"})</small></span>
        <span>${formatearSoles(producto.precio * producto.cantidad)}</span>
      </li>`).join("");

    return `
      <article class="order">
        <header class="order__header">
          <div>
            <p class="order__code">Pedido ${pedido.codigo}</p>
            <p class="order__date">${formatearFecha(pedido.fecha)}</p>
          </div>
          <span class="order__status">${ESTADOS_PEDIDO[etapa].nombre}</span>
        </header>
        <ol class="order__steps" aria-label="Estado del pedido">${pasos}</ol>
        <ul class="order__products">${productos}</ul>
        <p class="order__total"><span>Total</span><strong>${formatearSoles(pedido.total)}</strong></p>
      </article>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  // Refresca el estado cada vez que se abre el panel
  document.getElementById("orders-drawer")?.addEventListener("panel:open", renderizarPedidos);
});
