const container = document.getElementById('products');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const categorySelect = document.getElementById('category');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');

// Función para obtener los productos desde la API
async function getProducts() {
    try {
        loader.style.display = 'block'; // Mostrar el loader mientras se cargan los productos

        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();        

        // renderProducts(data.products);
        allProducts = data.products; // Guardar los productos para la búsqueda
        renderProducts(allProducts); // Renderizar los productos inicialmente      
    } catch (error) {
        console.error('Error fetching products:', error);
        container.innerHTML = '<p>Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.</p>';
    } finally {
        loader.style.display = 'none'; // Ocultar el loader después de cargar los productos
    }
}

// Función para renderizar los productos en el DOM
function renderProducts(products) {
    container.innerHTML = '';

    products.forEach(product => {
        
        container.innerHTML += `
            <div class="product">
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${truncateText(product.title, 40)}</h3>
                <p>$${product.price}</p>
                <button onclick="showDetail(${product.id})" class="btn-ver">Ver más</button>
                <button onclick="addToCart(${product.id})" class="btn-ver">Agregar al carrito</button>
            </div>
        `;
    });
}

// Función para mostrar el detalle del producto
function showDetail(id){
    const product = allProducts.find(p => p.id === id);
    
    modalBody.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.images[0]}" alt="${product.title}">
        <p>${product.description}</p>
        <p><strong>$${product.price}</strong></p>
        <button onclick="addToCart(${product.id})" class="btn-ver">Agregar al carrito</button>
    `;

    modal.classList.remove('hidden');
}

// Función para cerrar el modal
document.getElementById('close-modal').onclick = () => {
    modal.classList.add('hidden');
    renderProducts(allProducts); // Volver a renderizar los productos al cerrar el modal
};

// Cerrar el modal al hacer clic fuera del contenido
modal.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.classList.add('hidden');
        renderProducts(allProducts); // Volver a renderizar los productos al cerrar el modal
    }
});

// Función para filtrar por categoría
categorySelect.addEventListener('change', (e) => {
    const value = e.target.value;

    if(value === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === value);
        renderProducts(filtered);
    }
});

//Función para limitar el titulo del producto
function truncateText(text, maxLength) {
    return text.length > maxLength 
        ? text.substring(0, maxLength) + '...'
        : text;
}

// Llamar a la función para obtener y mostrar los productos al cargar la página
getProducts();

let allProducts = [];

const searchInput = document.getElementById('search');

searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(value)
    );

    renderProducts(filtered);
});

let cart = [];

// Función para agregar productos al carrito
function addToCart(id) {
    const product = allProducts.find(p => p.id === id); // Encontrar el producto por su ID
    const existsInCart = cart.find(p => p.id === id); // Verificar si el producto ya está en el carrito

    if(existsInCart) {
        existsInCart.quantity += 1; // Incrementar la cantidad si el producto ya está en el carrito
        Swal.fire({
            title: '¡Producto actualizado!',
            text: `La cantidad de ${product.title} en el carrito ha sido actualizada.`,
            icon: 'info',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#1A3D63',
            timer: 2000
        });

    } else {
        Swal.fire({
            title: '¡Producto agregado!',
            text: `${product.title} ha sido agregado al carrito.`,
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#1A3D63',
            timer: 2000
        });
        cart.push({ ...product, quantity: 1 }); // Agregar el producto al carrito con cantidad inicial de 1     
    }

    updateCartCount();
    renderCart(); // Actualizar el carrito para reflejar los cambios
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((total, product) => total + (product.quantity || 1), 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Función para mostrar el modal del carrito
document.querySelector('.cart-icon').onclick = () => {
    renderCart();
    cartModal.classList.remove('hidden');
}

document.getElementById('close-cart').onclick = () => {
    cartModal.classList.add('hidden');
}

// Función para renderizar los productos en el carrito
function renderCart() {
    cartItemsContainer.innerHTML = '';

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    cart.forEach(product => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${product.thumbnail}" alt="${product.title}">

                <div class="cart-title">
                    <h4>${product.title}</h4>
                </div>

                <div class="cart-quantity">
                    <p></p>Cantidad: ${product.quantity}</p>
                </div>
                
                <div class="cart-price">
                    <p>$${(product.price * product.quantity).toFixed(2)}</p>
                </div>
                
                <button onclick="removeFromCart(${product.id})" class="btn-remove">
                    ❌
                </button>
            </div>
        `;
    });

    renderTotal();
}

// Función para eliminar un producto del carrito
function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);

    renderCart();
    updateCartCount();
}

// Cerrar el modal del carrito al hacer clic fuera del contenido
cartModal.addEventListener('click', (e) => {
    if(e.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    renderCart();
    updateCartCount();
}

// Función para calcular y mostrar el total del carrito
function renderTotal() {
    const total = cart.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    cartItemsContainer.innerHTML += `
        <div class="cart-total">
            <h3>Total: $${total.toFixed(2)}</h3>
        </div>
    `;
}