const container = document.getElementById('products');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const categorySelect = document.getElementById('category');

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
                <img src="${product.images[0]}" alt="${product.title}">
                <h3>${truncateText(product.title, 40)}</h3>
                <p>$${product.price}</p>
                <button onclick="showDetail(${product.id})" class="btn-ver">Ver más</button>
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
    `;

    modal.classList.remove('hidden');
}

// Función para cerrar el modal
document.getElementById('close-modal').onclick = () => {
    modal.classList.add('hidden');
    renderProducts(allProducts); // Volver a renderizar los productos al cerrar el modal
};

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