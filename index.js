let todosLosProductos = [];

async function obtenerProductos() {
    try {
        const respuesta = await fetch('https://dummyjson.com/products/category/beauty');
        const datos = await respuesta.json();
        todosLosProductos = datos.products;
        
        renderizarProductos(todosLosProductos);
        actualizarContadorCarrito();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        const contenedor = document.getElementById('products-grid');
        if (contenedor) contenedor.innerHTML = '<p>Error al cargar los productos. Intenta recargar la página.</p>';
    }
}

function renderizarProductos(productos) {
    const contenedor = document.getElementById('products-grid'); 
    if (!contenedor) return; 
    
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const precioOriginal = (producto.price * 1.25).toFixed(2);
        
        const tarjeta = document.createElement('div');
        tarjeta.className = 'product-card'; 
        
        tarjeta.innerHTML = `
            <div class="sale-badge">Oferta</div>
            <img src="${producto.thumbnail}" alt="${producto.title}" class="product-image">
            <div class="product-info">
                <h3>${producto.title}</h3>
                <div class="price-container">
                    <span class="old-price">$${precioOriginal}</span>
                    <span class="product-price">$${producto.price}</span>
                </div>
                <button class="btn-primary add-to-cart-btn" onclick='agregarAlCarrito(${JSON.stringify(producto).replace(/'/g, "\\'")})'>
                    Agregar al carrito
                </button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

const inputBusqueda = document.getElementById('product-search'); // ID real[cite: 4]
if (inputBusqueda) {
    inputBusqueda.addEventListener('input', (evento) => {
        const terminoBusqueda = evento.target.value.toLowerCase();
        const productosFiltrados = todosLosProductos.filter(p => 
            p.title.toLowerCase().includes(terminoBusqueda)
        );
        renderizarProductos(productosFiltrados);
    });
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    actualizarContadorCarrito();

    const irAlCarrito = window.confirm(`${producto.title} agregado. ¿Deseas ir al carrito?`);
    if (irAlCarrito) {
        window.location.href = 'cart.html';
    }
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-counter'); // ID real[cite: 4]
    if (contador) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        contador.textContent = carrito.length;
    }
}

document.addEventListener('DOMContentLoaded', obtenerProductos);