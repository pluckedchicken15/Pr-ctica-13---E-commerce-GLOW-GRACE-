function renderizarCarrito() {
    const contenedorCarrito = document.getElementById('cart-items-container'); 
    const contadorResumen = document.getElementById('summary-count'); 
    const totalResumen = document.getElementById('summary-total'); 
    
    if (!contenedorCarrito) return;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Tu carrito está vacío.</p>
                <a href="index.html" class="btn-primary" style="text-decoration: none;">Ir a comprar</a>
            </div>
        `;
        if (contadorResumen) contadorResumen.textContent = '0';
        if (totalResumen) totalResumen.textContent = '$0.00';
        return;
    }

    let total = 0;
    
    carrito.forEach((producto, indice) => {
        total += producto.price;
        const elemento = document.createElement('div');
        elemento.className = 'cart-item'; 
        
        elemento.innerHTML = `
            <img src="${producto.thumbnail}" alt="${producto.title}" style="width: 80px; object-fit: cover; border-radius: 8px;">
            <div class="cart-item-info">
                <h4>${producto.title}</h4>
                <p>$${producto.price}</p>
            </div>
            <button class="delete-btn" onclick="eliminarDelCarrito(${indice})">
                <i data-lucide="trash-2"></i> Eliminar
            </button>
        `;
        contenedorCarrito.appendChild(elemento);
    });

    if (contadorResumen) contadorResumen.textContent = carrito.length;
    if (totalResumen) totalResumen.textContent = `$${total.toFixed(2)}`;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function eliminarDelCarrito(indice) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(indice, 1); 
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito(); 
}

const formularioCheckout = document.getElementById('checkout-form-page'); 
if (formularioCheckout) {
    formularioCheckout.addEventListener('submit', async (evento) => {
        evento.preventDefault(); 
        
        const correo = document.getElementById('email').value; 
        const telefono = document.getElementById('phone').value; 
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        if (carrito.length === 0) {
            window.alert('Agrega productos antes de confirmar.');
            return;
        }

        const cargaProductos = carrito.map(item => ({ id: item.id, quantity: 1 }));

        try {
            const btnConfirmar = document.getElementById('confirm-btn'); 
            btnConfirmar.textContent = 'Procesando...';
            btnConfirmar.disabled = true;

            const respuesta = await fetch('https://dummyjson.com/carts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1, 
                    products: cargaProductos
                })
            });

            if (respuesta.ok) {
                window.alert(`¡Compra exitosa!\nEnviaremos los detalles a: ${correo}\nTeléfono de contacto: ${telefono}`);
                localStorage.removeItem('carrito');
                window.location.href = 'index.html';
            } else {
                throw new Error('Error en la API');
            }
        } catch (error) {
            console.error('Error:', error);
            window.alert('Ocurrió un error. Intenta de nuevo.');
            
            const btnConfirmar = document.getElementById('confirm-btn');
            btnConfirmar.textContent = 'Confirmar Compra';
            btnConfirmar.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', renderizarCarrito);