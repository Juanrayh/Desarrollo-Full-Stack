class CarritoService {
    static BASE_URL = '/floreriaholanda/api';
    
    static async getProductos() {
        const response = await fetch(`${this.BASE_URL}/productos`);
        return await response.json();
    }
    
    static async getCarrito() {
        const response = await fetch(`${this.BASE_URL}/carrito`);
        return await response.json();
    }
    
    static async addToCart(productoId, cantidad = 1) {
        const response = await fetch(`${this.BASE_URL}/carrito`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ producto_id: productoId, cantidad })
        });
        return await response.json();
    }
    
    static async removeFromCart(productoId) {
        const response = await fetch(`${this.BASE_URL}/carrito`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ producto_id: productoId })
        });
        return await response.json();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const actualizarCarritoUI = async () => {
        try {
            const response = await CarritoService.getCarrito();
            if (response.status === 'success') {
                const carritoList = document.getElementById('carrito-list');
                const items = response.data.items;
                const total = response.data.total;
                
                let html = '';
                if (Object.keys(items).length > 0) {
                    for (const [id, item] of Object.entries(items)) {
                        html += `
                            <li>
                                <img src="${item.imagen}" alt="${item.nombre}">
                                ${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad}
                                <button class="eliminar" data-producto-id="${item.id}">Eliminar</button>
                            </li>
                        `;
                    }
                    html += `<p id="carrito-total">Total: $${total.toFixed(2)}</p>`;
                } else {
                    html = '<p>El carrito está vacío</p>';
                }
                
                carritoList.innerHTML = html;
                
                // Agregar event listeners a los botones de eliminar
                document.querySelectorAll('.eliminar').forEach(button => {
                    button.addEventListener('click', async function() {
                        const productoId = this.dataset.productoId;
                        try {
                            const response = await CarritoService.removeFromCart(productoId);
                            if (response.status === 'success') {
                                await actualizarCarritoUI();
                                alert('Producto eliminado del carrito');
                            }
                        } catch (error) {
                            console.error('Error al eliminar del carrito:', error);
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
        }
    };

    // Agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.dataset.productId;
            try {
                const response = await CarritoService.addToCart(productId);
                if (response.status === 'success') {
                    await actualizarCarritoUI();
                    alert('Producto agregado al carrito');
                }
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
            }
        });
    });

    // Vaciar carrito
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', async function() {
            try {
                const response = await fetch(`${CarritoService.BASE_URL}/carrito/vaciar`, {
                    method: 'POST'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    await actualizarCarritoUI();
                    alert('Carrito vaciado');
                }
            } catch (error) {
                console.error('Error al vaciar el carrito:', error);
            }
        });
    }

    // Inicializar carrito
    actualizarCarritoUI();
}); 