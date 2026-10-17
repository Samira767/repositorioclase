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
