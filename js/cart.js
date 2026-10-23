// =========================================================================
// LÓGICA DEL CARRITO DE COMPRAS - SOVERFER (INTEGRANTE 3)
// =========================================================================

// 1. Cargar el carrito desde localStorage (si ya tiene datos guardados) o iniciar vacío []
const CLAVE_CARRITO = 'carrito_aeris';
let carrito = (JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [])
    // Compatibilidad con productos guardados antes de tener tallas
    .map(item => ({ ...item, clave: item.clave || String(item.id) }));

// Talla elegida en la vista rápida
let tallaSeleccionada = null;

// 2. Al cargar la página: actualizar la burbuja del header y dibujar el carrito
document.addEventListener('DOMContentLoaded', () => {
    actualizarBurbujaHeader();
    renderizarCarrito();
    configurarPanelCarrito();
});

// Formato de moneda en soles
function formatearSoles(precio) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(precio);
}

// Guardar en el navegador y refrescar todo lo que depende del carrito
function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarBurbujaHeader();
    renderizarCarrito();
}

// 3. FUNCIÓN: Añadir un producto (o sumar 1 si ya existe con la misma talla)
// El catálogo la llama con: agregarProducto(id, nombre, precio, imagen, talla)
function agregarProducto(id, nombre, precio, imagen = '', talla = 'M') {
    const clave = `${id}-${talla}`;
    const productoExistente = carrito.find(item => item.clave === clave);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ clave, id, nombre, precio, imagen, talla, cantidad: 1 });
    }

    guardarCarrito();

    if (typeof mostrarAviso === 'function') {
        mostrarAviso(`${nombre} (talla ${talla}) se agregó al carrito`);
    }
}

// Cambiar la cantidad de un producto (+1 / -1). Si llega a 0, se elimina.
function cambiarCantidad(clave, cambio) {
    const item = carrito.find(producto => producto.clave === clave);
    if (!item) return;

    item.cantidad += cambio;
    if (item.cantidad <= 0) {
        eliminarProducto(clave);
        return;
    }
    guardarCarrito();
}

function eliminarProducto(clave) {
    carrito = carrito.filter(item => item.clave !== clave);
    guardarCarrito();
}

// 4. FUNCIÓN: Calcular el total de prendas y actualizar el [data-cart-count] del header
function actualizarBurbujaHeader() {
    const burbuja = document.querySelector('[data-cart-count]');

    if (burbuja) {
        const totalProductos = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
        burbuja.innerText = totalProductos;

        // Si el carrito está vacío se oculta la burbuja
        if (totalProductos === 0) {
            burbuja.setAttribute('hidden', '');
        } else {
            burbuja.removeAttribute('hidden');
        }
    }
}

// =========================================================================
// PANEL DEL CARRITO (aside#cart-drawer)
// =========================================================================

function renderizarCarrito() {
    const lista = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');
    const footer = document.getElementById('cart-footer');
    if (!lista) return;

    if (carrito.length === 0) {
        lista.innerHTML = `
            <div class="drawer__empty">
                <p>Tu carrito está vacío.</p>
                <a class="btn btn--outline" href="#catalogo" data-close-panel>Ver colección</a>
            </div>`;
        if (footer) footer.hidden = true;
        return;
    }

    lista.innerHTML = carrito.map(item => `
        <article class="cart-item">
            <img class="cart-item__image" src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-item__info">
                <h3 class="cart-item__name">${item.nombre}</h3>
                <p class="cart-item__meta">Talla: ${item.talla || 'Única'}</p>
                <div class="cart-item__qty">
                    <button class="cart-item__qty-btn" type="button" data-cart-action="restar" data-clave="${item.clave}" aria-label="Quitar una unidad">−</button>
                    <span class="cart-item__qty-value">${item.cantidad}</span>
                    <button class="cart-item__qty-btn" type="button" data-cart-action="sumar" data-clave="${item.clave}" aria-label="Agregar una unidad">+</button>
                </div>
            </div>
            <div class="cart-item__side">
                <p class="cart-item__price">${formatearSoles(item.precio * item.cantidad)}</p>
                <button class="cart-item__remove" type="button" data-cart-action="eliminar" data-clave="${item.clave}">Eliminar</button>
            </div>
        </article>
    `).join('');

    const subtotal = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    if (total) total.innerText = formatearSoles(subtotal);
    if (footer) footer.hidden = false;
}

function configurarPanelCarrito() {
    const lista = document.getElementById('cart-items');
    const btnFinalizar = document.getElementById('cart-checkout');

    // Botones + / − / Eliminar de cada producto
    lista?.addEventListener('click', (e) => {
        const boton = e.target.closest('[data-cart-action]');
        if (!boton) return;

        const { cartAction, clave } = boton.dataset;
        if (cartAction === 'sumar') cambiarCantidad(clave, 1);
        if (cartAction === 'restar') cambiarCantidad(clave, -1);
        if (cartAction === 'eliminar') eliminarProducto(clave);
    });

    // Finalizar compra (simulado): pide iniciar sesión si no hay usuario
    btnFinalizar?.addEventListener('click', () => {
        const usuario = typeof obtenerUsuarioActual === 'function' ? obtenerUsuarioActual() : null;

        if (!usuario) {
            abrirPanel('account-drawer');
            mostrarAviso('Inicia sesión para finalizar tu compra');
            return;
        }

        carrito = [];
        guardarCarrito();
        cerrarPanel();
        mostrarAviso(`¡Gracias, ${usuario.nombre}! Tu pedido fue registrado.`);
    });
}

// =========================================================================
// INTERACCIONES DEL MODAL VISTA RÁPIDA
// =========================================================================

// Abrir el modal con la información del producto seleccionado
// productoData = { id, nombre, precio, imagen, descripcion? }
function abrirVistaRapida(productoData) {
    const modal = document.getElementById('vista-rapida-modal');
    if (!modal) return;

    const imagen = document.getElementById('modal-img');
    imagen.src = productoData.imagen;
    imagen.alt = productoData.nombre;
    document.getElementById('modal-titulo').innerText = productoData.nombre;
    document.getElementById('modal-precio').innerText = formatearSoles(productoData.precio);
    document.getElementById('modal-descripcion').innerText = productoData.descripcion || "Prenda de la colección de temporada SOVERFER. Diseño minimalista confeccionado con materiales de alta calidad.";

    // Reiniciar la talla elegida
    tallaSeleccionada = null;
    document.querySelectorAll('.modal__talla-btn').forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
    });
    document.getElementById('modal-error').hidden = true;

    // Botón "Agregar al carrito" del modal: exige elegir talla
    const btnAgregarInterno = document.getElementById('modal-btn-agregar');
    btnAgregarInterno.onclick = () => {
        if (!tallaSeleccionada) {
            document.getElementById('modal-error').hidden = false;
            return;
        }
        agregarProducto(productoData.id, productoData.nombre, productoData.precio, productoData.imagen, tallaSeleccionada);
        cerrarVistaRapida();
    };

    modal.removeAttribute('hidden');
    document.getElementById('btn-cerrar-modal')?.focus();
}

function cerrarVistaRapida() {
    const modal = document.getElementById('vista-rapida-modal');
    if (modal) {
        modal.setAttribute('hidden', '');
    }
}

// Cierre con la (X), clic fuera del contenedor o tecla Escape + selección de talla
document.addEventListener('DOMContentLoaded', () => {
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const modal = document.getElementById('vista-rapida-modal');

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarVistaRapida);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarVistaRapida();
                return;
            }

            const botonTalla = e.target.closest('.modal__talla-btn');
            if (botonTalla) {
                document.querySelectorAll('.modal__talla-btn').forEach(btn => {
                    btn.classList.toggle('is-active', btn === botonTalla);
                    btn.setAttribute('aria-pressed', String(btn === botonTalla));
                });
                tallaSeleccionada = botonTalla.innerText.trim();
                document.getElementById('modal-error').hidden = true;
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.hidden) cerrarVistaRapida();
    });
});
