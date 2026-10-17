// =========================================================================
// LÓGICA DEL CARRITO DE COMPRAS - AERIS (INTEGRANTE 3)
// =========================================================================

// 1. Cargar el carrito desde localStorage (si ya tiene datos guardados) o iniciar vacío []
let carrito = JSON.parse(localStorage.getItem('carrito_aeris')) || [];

// 2. Al cargar la página por completo, se actualiza la burbuja del header y se preparan los botones
document.addEventListener('DOMContentLoaded', () => {
    actualizarBurbujaHeader();
    configurarBotonesComprar();
});

// 3. FUNCIÓN: Detectar los clics en los botones de "Agregar al carrito"
function configurarBotonesComprar() {
    // Escucha todos los botones que tengan la clase 'btn-agregar' (coordinar con tu compañero de catálogo)
    const botones = document.querySelectorAll('.btn-agregar');
    
    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Prevenir comportamientos por defecto del botón si los hubiera
            e.preventDefault();
            
            // Capturar los datos del producto que están guardados en los atributos del HTML (data-*)
            const id = e.target.dataset.id;
            const nombre = e.target.dataset.nombre;
            const precio = parseFloat(e.target.dataset.price);
            
            // Ejecutar la función para añadir el producto al arreglo
            agregarProducto(id, nombre, precio);
        });
    });
}

// 4. FUNCIÓN: Lógica para añadir o incrementar las unidades de un producto
function agregarProducto(id, nombre, precio) {
    // Buscar si el producto que se quiere agregar ya existe previamente en el carrito
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        // Si ya existe, simplemente le sumamos 1 a su cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si es nuevo, lo empujamos al arreglo con sus propiedades iniciales
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // Guardar el estado actualizado del carrito de forma persistente en el navegador
    localStorage.setItem('carrito_aeris', JSON.stringify(carrito));
    
    // Actualizar la viñeta numérica inmediatamente en la pantalla
    actualizarBurbujaHeader();
}

// 5. FUNCIÓN: Calcular el total de prendas y actualizar el [data-cart-count] de tu compañera
function actualizarBurbujaHeader() {
    // Selecciona de forma automática el span exacto que colocó tu compañera mediante su atributo personalizado
    const burbuja = document.querySelector('[data-cart-count]');
    
    if (burbuja) {
        // Reducir el arreglo para sumar todas las cantidades (.cantidad) de los productos agregados
        const totalProductos = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
        
        // Escribir el número total calculado en el elemento HTML
        burbuja.innerText = totalProductos;
        
        // Si el carrito está vacío (0), le ponemos el atributo hidden para que se oculte de forma elegante
        if (totalProductos === 0) {
            burbuja.setAttribute('hidden', '');
        } else {
            // Si tiene al menos un producto, le removemos el atributo hidden para que sea visible
            burbuja.removeAttribute('hidden');
        }
    }
}
// =========================================================================
// INTERACCIONES DEL MODAL VISTA RÁPIDA
// =========================================================================

// Función para abrir el modal cargando la información del producto seleccionado
function abrirVistaRapida(productoData) {
    const modal = document.getElementById('vista-rapida-modal');
    
    if (modal) {
        // Inyectar los datos dinámicamente en los elementos del modal
        document.getElementById('modal-img').src = productoData.imagen;
        document.getElementById('modal-titulo').innerText = productoData.nombre;
        document.getElementById('modal-precio').innerText = `S/. ${productoData.precio.toFixed(2)}`;
        document.getElementById('modal-descripcion').innerText = productoData.descripcion || "Prenda de la colección de temporada AERIS. Diseño minimalista confeccionado con materiales de alta calidad.";
        
        // Configurar el botón de comprar interno del modal para que funcione con tu carrito
        const btnAgregarInterno = document.getElementById('modal-btn-agregar');
        btnAgregarInterno.onclick = () => {
            agregarProducto(productoData.id, productoData.nombre, productoData.precio);
            cerrarVistaRapida();
        };

        // Mostrar el modal quitando el atributo hidden
        modal.removeAttribute('hidden');
    }
}

// Función para cerrar el modal
function cerrarVistaRapida() {
    const modal = document.getElementById('vista-rapida-modal');
    if (modal) {
        modal.setAttribute('hidden', '');
    }
}

// Configurar el evento de cierre al hacer clic en la (X) o fuera del contenedor
document.addEventListener('DOMContentLoaded', () => {
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const modal = document.getElementById('vista-rapida-modal');

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarVistaRapida);
    }

    // Cerrar si hacen clic en el fondo oscuro
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarVistaRapida();
        });
    }
});
