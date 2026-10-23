
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

// Favoritos guardados en el navegador para que no se pierdan al recargar
const CLAVE_FAVORITOS = "favoritos_aeris";
const favoritos = new Set(JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || []);

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
        <button
          class="product-card__quickview"
          type="button"
          data-quickview-id="${producto.id}"
          aria-label="Vista rápida de ${producto.nombre}"
        >
          <img
            class="product-card__image"
            src="${producto.imagen}"
            alt="${producto.nombre}"
            loading="lazy"
          >
          <span class="product-card__quickview-label">Vista rápida</span>
        </button>

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

  <button
    class="product-card__add"
    type="button"
    data-add-id="${producto.id}">
    + Agregar rápido
  </button>
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
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify([...favoritos]));
  renderizarFavoritos();

  if (!contadorFavoritos) return;

  contadorFavoritos.textContent = String(favoritos.size);
  contadorFavoritos.hidden = favoritos.size === 0;
}

/* Panel de favoritos (aside#favorites-drawer) */
function renderizarFavoritos() {
  const lista = document.querySelector("#favorites-items");
  if (!lista) return;

  const productosFavoritos = products.filter((p) => favoritos.has(p.id));

  if (!productosFavoritos.length) {
    lista.innerHTML = `
      <div class="drawer__empty">
        <p>Aún no tienes favoritos.<br>Toca el ♡ de una prenda para guardarla aquí.</p>
        <a class="btn btn--outline" href="#catalogo" data-close-panel>Ver colección</a>
      </div>`;
    return;
  }

  lista.innerHTML = productosFavoritos.map((producto) => `
    <article class="cart-item">
      <button class="cart-item__image-btn" type="button" data-quickview-id="${producto.id}" aria-label="Vista rápida de ${producto.nombre}">
        <img class="cart-item__image" src="${producto.imagen}" alt="${producto.nombre}">
      </button>
      <div class="cart-item__info">
        <h3 class="cart-item__name">${producto.nombre}</h3>
        <p class="cart-item__meta">${formatearPrecio(producto.precio)}</p>
        <button class="btn btn--dark cart-item__add" type="button" data-quickview-id="${producto.id}">Elegir talla</button>
      </div>
      <div class="cart-item__side">
        <button class="cart-item__remove" type="button" data-favorite-id="${producto.id}">Quitar</button>
      </div>
    </article>
  `).join("");
}

/* Búsqueda (panel #search-panel) */
function renderizarBusqueda(texto) {
  const resultados = document.querySelector("#search-results");
  if (!resultados) return;

  const consulta = texto.trim().toLowerCase();
  if (!consulta) {
    resultados.innerHTML = "";
    return;
  }

  const encontrados = products.filter((p) =>
    `${p.nombre} ${p.categoria} ${p.genero}`.toLowerCase().includes(consulta)
  );

  resultados.innerHTML = encontrados.length
    ? encontrados.map((p) => `
        <button class="search-result" type="button" data-quickview-id="${p.id}">
          <img class="search-result__image" src="${p.imagen}" alt="">
          <span>
            <span class="search-result__name">${p.nombre}</span>
            <span class="search-result__price">${formatearPrecio(p.precio)}</span>
          </span>
        </button>`).join("")
    : `<p class="search-panel__empty">No encontramos prendas para “${texto.trim()}”.</p>`;
}

document.querySelector("#search-input")?.addEventListener("input", (evento) => {
  renderizarBusqueda(evento.target.value);
});

document.querySelector("#search-form")?.addEventListener("submit", (evento) => {
  evento.preventDefault();
});

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

  // Enlaces "Hombre" / "Mujer" del menú y del footer: filtran el catálogo
  const enlaceGenero = evento.target.closest('a[href="#hombre"], a[href="#mujer"]');

  if (enlaceGenero) {
    evento.preventDefault();
    filtroGenero = enlaceGenero.getAttribute("href") === "#hombre" ? "Hombre" : "Mujer";
    filtroCategoria = "Todas";
    renderizarProductos();
    document.querySelector("#catalogo")?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // "+ Agregar rápido": agrega al carrito con talla M (función de cart.js)
  const botonAgregar = evento.target.closest("[data-add-id]");

  if (botonAgregar) {
    const id = Number(botonAgregar.dataset.addId);
    const producto = products.find((p) => p.id === id);

    if (producto) {
      agregarProducto(producto.id, producto.nombre, producto.precio, producto.imagen, "M");
    }

    return;
  }

  // Clic en la imagen: abre la vista rápida (función de cart.js)
  const botonVistaRapida = evento.target.closest("[data-quickview-id]");

  if (botonVistaRapida) {
    const id = Number(botonVistaRapida.dataset.quickviewId);
    const producto = products.find((p) => p.id === id);

    if (producto) {
      abrirVistaRapida(producto);
    }

    return;
  }

  const botonFavorito = evento.target.closest("[data-favorite-id]");

  if (botonFavorito) {
    const id = Number(botonFavorito.dataset.favoriteId);

    const producto = products.find((p) => p.id === id);

    if (favoritos.has(id)) {
      favoritos.delete(id);
      mostrarAviso(`${producto.nombre} se quitó de favoritos`);
    } else {
      favoritos.add(id);
      mostrarAviso(`${producto.nombre} se guardó en favoritos ♥`);
    }

    renderizarProductos();
  }
});

renderizarProductos();

