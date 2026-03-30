const container = document.getElementById('products');
const loader = document.getElementById('loader');

// Función para obtener los productos desde la API
async function getProducts() {
    try {
        loader.style.display = 'block'; // Mostrar el loader mientras se cargan los productos

        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();

        renderProducts(data);
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
                <img src="${product.image}" alt="${product.title}">
                <h3>${truncateText(product.title, 40)}</h3>
                <p>$${product.price}</p>
                <button class="btn-ver">Ver más</button>
            </div>
        `;
    });
}

//Función para limitar el titulo del producto
function truncateText(text, maxLength) {
    return text.length > maxLength 
        ? text.substring(0, maxLength) + '...'
        : text;
}

// Llamar a la función para obtener y mostrar los productos al cargar la página
getProducts();