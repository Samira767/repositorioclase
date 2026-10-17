
/* ==========================================
   AERIS - CATALOGO DE PRODUCTOS
   Integrante 2
   ========================================== */

const products = [
  {
    id: 1,
    nombre: "Vestido Floral Primavera",
    precio: 89.90,
    categoria: "Vestidos",
    genero: "Mujer",
    imagen: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=80",
    novedad: true
  },
  {
    id: 2,
    nombre: "Camisa Clasica Blanca",
    precio: 69.90,
    categoria: "Camisas",
    genero: "Hombre",
    imagen: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80",
    novedad: true
  },
  {
    id: 3,
    nombre: "Jeans Rectos Azules",
    precio: 99.90,
    categoria: "Jeans",
    genero: "Mujer",
    imagen: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80",
    novedad: false
  },
  {
    id: 4,
    nombre: "Saco Elegante",
    precio: 159.90,
    categoria: "Sacos",
    genero: "Hombre",
    imagen: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80",
    novedad: true
  },
  {
    id: 5,
    nombre: "Vestido Negro",
    precio: 119.90,
    categoria: "Vestidos",
    genero: "Mujer",
    imagen: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    novedad: false
  },
  {
    id: 6,
    nombre: "Camisa Casual",
    precio: 74.90,
    categoria: "Camisas",
    genero: "Hombre",
    imagen: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80",
    novedad: false
  },
  {
    id: 7,
    nombre: "Jeans Clasicos",
    precio: 109.90,
    categoria: "Jeans",
    genero: "Hombre",
    imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
    novedad: true
  },
  {
    id: 8,
    nombre: "Saco Moderno",
    precio: 149.90,
    categoria: "Sacos",
    genero: "Mujer",
    imagen: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=80",
    novedad: false
  }
];

let filtroGenero = "Todos";
let filtroCategoria = "Todas";

const favoritos = new Set();

const contenedorProductos = document.querySelector("#products-grid");
const contadorProductos = document.querySelector("#products-count");
const contadorFavoritos = document.querySelector("[data-favorites-count]");

const botonesFiltro = document.querySelectorAll(
  "[data-filter-type][data-filter-value]"
);

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
  }).format(precio);
}

function crearTarjeta(producto) {
  const esFavorito = favoritos.has(producto.id);

  return `
    <article class="product-card">
      <div class="product-card__image-wrap">
        <img
          class="product-card__image"
          src="${producto.imagen}"
          alt="${producto.nombre}"
          loading="lazy"
        >

        ${
          producto.novedad
            ? '<span class="product-card__badge">Novedad</span>'
            : ""
        }

        <button
          class="product-card__favorite ${esFavorito ? "is-favorite" : ""}"
          type="button"
          data-favorite-id="${producto.id}"
          aria-label="${esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}"
          aria-pressed="${esFavorito}"
        >${esFavorito ? "♥" : "♡"}</button>
      </div>

      <div class="product-card__info">
        <p class="product-card__category">
          ${producto.genero} · ${producto.categoria}
        </p>
        <h3 class="product-card__name">${producto.nombre}</h3>
        <p class="product-card__price">
          ${formatearPrecio(producto.precio)}
        </p>
      </div>
    </article>
  `;
}

function obtenerProductosFiltrados() {
  return products.filter((producto) => {
    const coincideGenero =
      filtroGenero === "Todos" ||
      producto.genero === filtroGenero;

    const coincideCategoria =
      filtroCategoria === "Todas" ||
      producto.categoria === filtroCategoria;

    return coincideGenero && coincideCategoria;
  });
}

function actualizarBotonesFiltro() {
  botonesFiltro.forEach((boton) => {
    const tipo = boton.dataset.filterType;
    const valor = boton.dataset.filterValue;

    const activo =
      (tipo === "genero" && valor === filtroGenero) ||
      (tipo === "categoria" && valor === filtroCategoria);

    boton.classList.toggle("is-active", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });
}

function actualizarContadorFavoritos() {
  if (!contadorFavoritos) return;

  contadorFavoritos.textContent = String(favoritos.size);
  contadorFavoritos.hidden = favoritos.size === 0;
}

function renderizarProductos() {
  if (!contenedorProductos) {
    console.warn("No se encontro #products-grid en index.html");
    return;
  }

  const productosFiltrados = obtenerProductosFiltrados();

  contenedorProductos.innerHTML = productosFiltrados.length
    ? productosFiltrados.map(crearTarjeta).join("")
    : '<p class="products-empty">No hay productos en esta categoría.</p>';

  if (contadorProductos) {
    contadorProductos.textContent =
      `${productosFiltrados.length} productos`;
  }

  actualizarBotonesFiltro();
  actualizarContadorFavoritos();
}

document.addEventListener("click", (evento) => {
  const botonFiltro = evento.target.closest("[data-filter-type]");

  if (botonFiltro) {
    const tipo = botonFiltro.dataset.filterType;
    const valor = botonFiltro.dataset.filterValue;

    if (tipo === "genero") {
      filtroGenero = valor;
    } else if (tipo === "categoria") {
      filtroCategoria = valor;
    }

    renderizarProductos();
    return;
  }

  const botonFavorito = evento.target.closest("[data-favorite-id]");

  if (botonFavorito) {
    const id = Number(botonFavorito.dataset.favoriteId);

    if (favoritos.has(id)) {
      favoritos.delete(id);
    } else {
      favoritos.add(id);
    }

    renderizarProductos();
  }
});

renderizarProductos();

