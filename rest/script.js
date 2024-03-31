document.addEventListener('DOMContentLoaded', function () {
    const restaurantList = document.querySelector('.restaurant-list');
    const cartItems = {}; // Object to store cart items and their quantities

    // Function to render restaurant listings
    function renderRestaurants(restaurants) {
        restaurants.forEach(restaurant => {
            const restaurantCard = document.createElement('div');
            restaurantCard.classList.add('restaurant-card');
            restaurantCard.innerHTML = `
                <div class="restaurant-details">
                    <img src="${restaurant.image}" alt="${restaurant.name}">
                    <h3>${restaurant.name}</h3>
                    <p><strong>Dish Name:</strong> ${restaurant.dish}</p>
                    <p><strong>Dish Price:</strong> $${restaurant.price}</p>
                    <p><strong>Quantity Left:</strong> ${restaurant.quantity}</p>
                    <p><strong>Distance from You:</strong> ${restaurant.distance}</p>
                    <p><strong>Expiry Date:</strong> ${restaurant.expiryDate}</p> <!-- Add this line -->
                    <div class="quantity-controls">
                        <button class="add-to-cart" data-name="${restaurant.name}">Add to Cart</button>
                    </div>
                </div>
            `;
            restaurantList.appendChild(restaurantCard);
        });
    }

    // Fetch restaurants data (replace with real API call in production)
    // For demonstration, we'll use the dataset from data.js
    renderRestaurants(restaurants);

    // Add event listener to handle "Add to Cart" button clicks
    restaurantList.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('add-to-cart')) {
            const itemName = target.getAttribute('data-name');
            addToCart(itemName);
            window.location.href = 'cart.html'; // Redirect to cart page
        }
    });

 // Function to add item to cart
function addToCart(name) {
    if (!cartItems[name]) {
        cartItems[name] = 0;
    }
    if (cartItems[name] < findRestaurantByName(name).quantity) {
        cartItems[name]++;
        // Store the updated cart items in localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}


    // Function to find restaurant by name and return its details
    function findRestaurantByName(name) {
        return restaurants.find(restaurant => restaurant.name === name);
    }
});
