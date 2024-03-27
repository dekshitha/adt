document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');

    // Function to render cart items
    function renderCartItems() {
        // Retrieve cart items from localStorage
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            const cartItems = JSON.parse(storedCartItems);
            // Clear previous content
            cartItemsContainer.innerHTML = '';
            // Loop through the cartItems object and create HTML elements for each item
            for (const itemName in cartItems) {
                if (cartItems.hasOwnProperty(itemName) && cartItems[itemName] > 0) {
                    const itemQuantity = cartItems[itemName];
                    const itemDetails = findRestaurantByName(itemName);

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    cartItemElement.innerHTML = `
                        <div class="item-details">
                            <h3>${itemDetails.name}</h3>
                            <p><strong>Dish Name:</strong> ${itemDetails.dish}</p>
                            <p><strong>Dish Price:</strong> $${itemDetails.price}</p>
                            <p><strong>Quantity:</strong> ${itemQuantity}</p>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                }
            }
        }
    }

    // Initial rendering of cart items
    renderCartItems();

    // Function to find restaurant by name and return its details
    // Assuming 'restaurants' is an array containing restaurant objects with 'name' property

function findRestaurantByName(name) {
    return restaurants.find(restaurant => restaurant.name === name);
}

});
