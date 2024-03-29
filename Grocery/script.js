document.addEventListener('DOMContentLoaded', function () {
    const groceryList = document.querySelector('.grocery-list');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {}; // Object to store cart items and their quantities

    // Function to render grocery listings
    function renderGroceries(groceries) {
        groceries.forEach(grocery => {
            const groceryCard = document.createElement('div');
            groceryCard.classList.add('grocery-card');
            groceryCard.innerHTML = `
                <div class="grocery-details">
                    <img src="${grocery.image}" alt="${grocery.name}">
                    <h3>${grocery.name}</h3>
                    <p><strong>Price:</strong> $${grocery.price}</p>
                    <p><strong>Quantity Left:</strong> ${grocery.quantity}</p>
                    <p><strong>Expiry Date:</strong> ${grocery.expiry}</p> <!-- Add this line -->
                    <div class="quantity-controls">
                        <button class="add-to-cart" data-name="${grocery.name}">Add to Cart</button>
                    </div>
                </div>
            `;
            groceryList.appendChild(groceryCard);
        });
    }

    // Fetch groceries data (replace with real API call in production)
    // For demonstration, we'll use the dataset from data.js
    renderGroceries(groceries);

    groceryList.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('add-to-cart')) {
            const itemName = target.getAttribute('data-name');
            const quantity = parseInt(prompt(`Enter the quantity for ${itemName}:`));
            if (!isNaN(quantity) && quantity > 0) {
                addToCart(itemName, quantity);
                window.location.href = 'cart.html'; // Redirect to cart page
            } else {
                alert('Please enter a valid quantity.');
            }
        }
    });
    

 // Function to add item to cart
// Function to add item to cart with specified quantity
function addToCart(name, quantity) {
    if (!cartItems[name]) {
        cartItems[name] = 0;
    }
    cartItems[name] += quantity;
    // Store the updated cart items in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}



    // Function to find grocery by name and return its details
    function findGroceryByName(name) {
        return groceries.find(grocery => grocery.name === name);
    }
});
