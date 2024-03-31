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
var ResQFeastDB = firebase.database().ref('ResQFeast').child('Stores');

document.getElementById('addStoreForm').addEventListener('submit', submitform);  

function submitform(e){
  e.preventDefault();

  var storeName = getElementVal('storeName');
  var storeAddress = getElementVal('storeAddress');
  var email = getElementVal('email');
  var contactNumber = getElementVal('contactNumber');
  const storeLogo = document.getElementById('storeLogo').files[0];

    // Upload logo file to Firebase Storage
    uploadLogo(storeLogo, (logoUrl) => {
    // Once upload is complete, save store details to the database including logo URL
    SaveDetailsToDB(storeName, storeAddress, email, contactNumber, logoUrl);
  });
}

// Function to upload logo file to Firebase Storage
function uploadLogo(file, callback) {
  var storageRef = firebase.storage().ref('storeLogos/' + file.name);

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

const SaveDetailsToDB = (storeName, storeAddress, email, contactNumber, logoUrl) => {
  // Get the current date and time
  const currentDate = new Date().toISOString();

  // Get the user who made the modification (you may need to retrieve this from your authentication system)
  const modifiedBy = "Admin User"; // Example: Replace this with the actual user's name or ID

  // Prepare the modification details
  const modificationDetails = "Initial store creation"; // Example: Replace this with appropriate details

  // Reference to the specific store in Firebase Realtime Database
  const storeRef = ResQFeastDB.push();

  // Push data to the database
  storeRef.set({
    storeName: storeName,
    storeAddress: storeAddress,
    email: email,
    contactNumber: contactNumber,
    storeLogo: logoUrl,
    DateModified: currentDate,
    ModifiedBy: modifiedBy,
    modificationHistory: {
      Modification1: {
        ModifiedDate: currentDate,
        ModifiedBy: modifiedBy,
        ModificationDetails: modificationDetails
      }
    }
  });
}

// Function to fetch and display store data from Firebase
function displayStoreData() {
  const storeTableBody = document.getElementById('storeTableBody');

  // Clear previous data
  storeTableBody.innerHTML = '';

  // Fetch stores data
  ResQFeastDB.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const storeData = childSnapshot.val();
      const storeId = childSnapshot.key;
      const { storeName, storeAddress, email, contactNumber, storeLogo } = storeData;

      // Check if storeName is present
      if (storeName) {
        // Create table row and cells
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${storeName}</td>
          <td>${storeAddress}</td>
          <td>${email}</td>
          <td>${contactNumber}</td>
          <td><img src="${storeLogo}" alt="${storeName} Logo" style="max-width: 100px;"></td>
          <td>
            <!-- Button to modify entry -->
            <button class="btn btn-primary" onclick="modifyStoreEntry('${storeId}')">Modify</button>
          </td>
        `;

        // Append row to table body
        storeTableBody.appendChild(row);
      }
    });
  });
}

// Call the function to display store data when the page loads
window.addEventListener('load', displayStoreData);

// Function to get value of all the fields in the form
const getElementVal = (id) => {
  return document.getElementById(id).value;
}
