const container = document.getElementById('products');

// Función para obtener los productos desde la API
async function getProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();

        renderProducts(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Función para renderizar los productos en el DOM
function renderProducts(products) {
    container.innerHTML = '';

    products.forEach(product => {
        container.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
            </div>
        `;
    });
}

// Llamar a la función para obtener y mostrar los productos al cargar la página
getProducts();