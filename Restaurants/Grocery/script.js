document.addEventListener('DOMContentLoaded', function () {
    const restaurantList = document.querySelector('.restaurant-list');
    const groceryList = document.querySelector('.grocery-list');
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
                    <p><strong>Main Ingredient:</strong> ${restaurant.ingredient}</p>
                    <p><strong>Distance from You:</strong> ${restaurant.distance}</p>
                    <div class="quantity-controls">
                        <button class="quantity-decrease" data-name="${restaurant.name}">-</button>
                        <span class="item-quantity">${cartItems[restaurant.name] || 0}</span>
                        <button class="quantity-increase" data-name="${restaurant.name}">+</button>
                    </div>
                </div>
            `;
            restaurantList.appendChild(restaurantCard);
        });
    }
    function renderGroceries(groceries) {
        groceries.forEach(grocery => {
            const groceryItem = document.createElement('div');
            groceryItem.classList.add('grocery-item');
            groceryItem.innerHTML = `
                <div class="grocery-details">
                    <img src="${grocery.image}" alt="${grocery.name}">
                    <h3>${grocery.name}</h3>
                    <p><strong>Type:</strong> ${grocery.type}</p>
                    <p><strong>Price:</strong> $${grocery.price.toFixed(2)}</p>
                    <p><strong>Quantity Available:</strong> ${grocery.quantity}</p>
                </div>
            `;
            groceryList.appendChild(groceryItem);
        });
    }
    // Fetch restaurants data (replace with real API call in production)
    // For demonstration, we'll use the dataset from data.js
    renderRestaurants(restaurants);
    renderGroceries(groceries);
    // Add event listeners to quantity decrease buttons
    restaurantList.addEventListener('click', function(event) {
        if (event.target.classList.contains('quantity-decrease')) {
            const itemName = event.target.getAttribute('data-name');
            decreaseQuantity(itemName);
        }
    });

    // Add event listeners to quantity increase buttons
    restaurantList.addEventListener('click', function(event) {
        if (event.target.classList.contains('quantity-increase')) {
            const itemName = event.target.getAttribute('data-name');
            increaseQuantity(itemName);
        }
    });

    // Function to decrease item quantity
    function decreaseQuantity(name) {
        if (cartItems[name] && cartItems[name] > 0) {
            cartItems[name]--;
            updateCartUI(); // Update cart UI
        }
    }

    // Function to increase item quantity
    function increaseQuantity(name) {
        if (!cartItems[name]) {
            cartItems[name] = 0;
        }
        cartItems[name]++;
        updateCartUI(); // Update cart UI
    }

    // Function to update cart UI
    function updateCartUI() {
        // Update UI to display cart items count or other relevant information
        const itemQuantities = document.querySelectorAll('.item-quantity');
        itemQuantities.forEach(itemQuantity => {
            const itemName = itemQuantity.previousElementSibling.getAttribute('alt');
            itemQuantity.textContent = cartItems[itemName] || 0; // Update quantity display
        });
    }
});
