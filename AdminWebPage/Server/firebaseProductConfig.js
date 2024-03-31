const firebaseConfig = {
    apiKey: "AIzaSyAgYSKr2iHWZhLvg4P7THhqUNK6-asafVw",
    authDomain: "resqfeast-dfbd5.firebaseapp.com",
    databaseURL: "https://resqfeast-dfbd5-default-rtdb.firebaseio.com",
    projectId: "resqfeast-dfbd5",
    storageBucket: "resqfeast-dfbd5.appspot.com",
    messagingSenderId: "786703754246",
    appId: "1:786703754246:web:a141a66a19202273228f87",
    measurementId: "G-70N9XYMCEC"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference for the database
var ResQFeastDB = firebase.database().ref('ResQFeast');

// Function to upload logo file to Firebase Storage
function uploadLogo(file, callback) {
    var storageRef = firebase.storage().ref('productLogo/' + file.name);

    // Upload file to Firebase Storage
    var task = storageRef.put(file);

    // Listen for state changes, errors, and completion of the upload.
    task.on('state_changed',
        function progress(snapshot) {
            // Handle progress
        },
        function error(err) {
            // Handle unsuccessful uploads
            console.error('Error uploading logo:', err);
        },
        function complete() {
            // Handle successful uploads
            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                // Pass download URL to the callback function
                callback(downloadURL);
            });
        }
    );
}

// Function to fetch store names from Firebase and populate the select element
function fetchStoreNames() {
    const storeNameSelect = document.getElementById('storeName');

    // Reference to the stores in Firebase Realtime Database
    const storesRef = firebase.database().ref('ResQFeast/Stores');

    // Fetch stores data
    storesRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const storeData = childSnapshot.val();
            const storeName = storeData.storeName;

            // Create option element
            const option = document.createElement('option');
            option.value = storeName;
            option.textContent = storeName;

            // Append option to select element
            storeNameSelect.appendChild(option);
        });
    });
}

// Call the function to fetch and populate store names when the page loads
window.addEventListener('load', fetchStoreNames);

// Function to submit the form data
function submitForm(event) {
    event.preventDefault();

    var productName = document.getElementById('productName').value;
    var productPrice = document.getElementById('productPrice').value;
    var description = document.getElementById('description').value;
    var stockAvailable = document.getElementById('stockAvailable').value;
    var expiryDate = document.getElementById('expiryDate').value;
    var pictureInput = document.getElementById('picture');
    var selectedStoreId = document.getElementById('storeName').value;

    // Check if a file is selected
    if (pictureInput.files.length === 0) {
        alert('Please select a picture.');
        return; // Exit the function early if no file is selected
    }

    var picture = pictureInput.files[0]; // Get the selected file

    // Upload picture to Firebase Storage (if needed)
    uploadLogo(picture, function(logoUrl) {
        // Save product data to the database
        saveProductToDatabase(productName, productPrice, description, stockAvailable, expiryDate, logoUrl,selectedStoreId);
    });
}


// Function to save product data to the database
function saveProductToDatabase(productName, productPrice, description, stockAvailable, expiryDate, logoUrl, selectedStoreId) {
    var currentDate = new Date().toISOString();
    var modifiedBy = "admin"; // Assuming the modification is done by an admin

    // Reference to the specific store in Firebase Realtime Database
    var selectedStoreId = document.getElementById('storeName').value;
    var productRef = firebase.database().ref('ResQFeast/Products/' + selectedStoreId + '/Products').push();

    // Push data to the database
    productRef.set({
        productName: productName,
        productPrice: productPrice,
        description: description,
        stockAvailable: stockAvailable,
        expiryDate: expiryDate,
        productLogo: logoUrl,
        DateModified: currentDate,
        ModifiedBy: modifiedBy,
        selectedStoreId : selectedStoreId,
        modificationHistory: {
            Modification1: {
                ModifiedDate: currentDate,
                ModifiedBy: modifiedBy,
                ModificationDetails: "Product added"
            }
        }
    }).then(function() {
        // Reset the form after successful submission
        document.getElementById('addProductForm').reset();
        alert('Product added successfully!');
    }).catch(function(error) {
        console.error('Error adding product:', error);
        alert('Error adding product. Please try again.');
    });
}

// Event listener for form submission
document.getElementById('addProductForm').addEventListener('submit', submitForm);

// Event listener for the storeName select element
document.getElementById('filterStore').addEventListener('change', function() {
    // Add console.log statement here
    console.log("Store selected:", this.value);

    const selectedStoreId = this.value;
    if (selectedStoreId) {
        // If a store is selected, display its products
        displayProductsData(selectedStoreId);
    } else {
        // If no store is selected, clear the table
        document.getElementById('ProdTableBody').innerHTML = '';
    }
});

// Function to fetch and display products data from Firebase for the selected store
function displayProductsData(selectedStoreId) {
    const ProdTableBody = document.getElementById('ProdTableBody');

    // Clear previous data
    ProdTableBody.innerHTML = '';

    // Reference to the selected store's products in Firebase Realtime Database
    const productsRef = firebase.database().ref('ResQFeast/Products/' + selectedStoreId + '/Products');

    console.log("Fetching products for store:", selectedStoreId);

    // Fetch products data
    productsRef.once('value', (snapshot) => {
        console.log("Products snapshot:", snapshot.val());
        snapshot.forEach((childSnapshot) => {
            const productData = childSnapshot.val();
            const productId = childSnapshot.key;
            const { productName, productPrice, description, stockAvailable, expiryDate, productLogo } = productData;

            console.log("Product Name:", productName);

            // Create table row and cells
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${productName}</td>
                <td>${productPrice}</td>
                <td>${description}</td>
                <td>${stockAvailable}</td>
                <td>${expiryDate}</td>
                <td><img src="${productLogo}" alt="${productName} Image" style="max-width: 100px;"></td>
                <td>${selectedStoreId}</td>
                <td>
                    <!-- Button or link for any actions (e.g., modify or delete) -->
                    <button class="btn btn-primary" onclick="modifyProductEntry('${selectedStoreId}', '${productId}')">Modify</button>
                </td>
            `;

            // Append row to table body
            ProdTableBody.appendChild(row);
        });
    });
}


// Function to handle modifying product entry
function modifyProductEntry(storeId, productId) {
    // Redirect to modify product page with storeId and productId parameters
    window.location.href = `ModifyProduct.html?storeId=${storeId}&productId=${productId}`;
}
