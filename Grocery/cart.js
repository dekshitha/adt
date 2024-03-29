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
            let totalPrice = 0;

            // Loop through the cartItems object and create HTML elements for each item
            for (const itemName in cartItems) {
                if (cartItems.hasOwnProperty(itemName) && cartItems[itemName] > 0) {
                    const itemQuantity = cartItems[itemName];
                    const itemDetails = findGroceryByName(itemName);

                    // Calculate the total price for each item
                    let itemPrice = itemDetails.price;
                    if (itemQuantity > 2) {
                        itemPrice *= 0.8; // Apply 20% discount if quantity is more than 2
                    }
                    const itemTotalPrice = itemPrice * itemQuantity;
                    totalPrice += itemTotalPrice;

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    cartItemElement.innerHTML = `
                        <div class="item-details">
                            <h3>${itemDetails.name}</h3>
                            <p><strong>Price:</strong> $${itemDetails.price.toFixed(2)}</p>
                            <p><strong>Quantity:</strong> ${itemQuantity}</p>
                            <p><strong>Total Price:</strong> $${itemTotalPrice.toFixed(2)}</p>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                }
            }

            // Render total price
            const totalPriceElement = document.createElement('div');
            totalPriceElement.innerHTML = `<h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
            cartItemsContainer.appendChild(totalPriceElement);
        }
    }

    // Initial rendering of cart items
    renderCartItems();

    // Function to find grocery by name and return its details
    function findGroceryByName(name) {
        return groceries.find(grocery => grocery.name === name);
    }
});