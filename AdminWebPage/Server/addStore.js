import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig.js'; // Assuming firebaseConfig.js is in the same directory
//import { initializeApp } from 'firebase/compat/app'; // Assuming firebase@compat is installed

// Initialize the firebase
firebase.initializeApp(firebaseConfig);

document.getElementById('addStoreForm').addEventListener('submit', submitform);  

function submitform(e){
  e.preventDefault();

  var storeName = getElementVal('storeName');
  var storeAddress = getElementVal('storeAddress');
  var email = getElementVal('email');
  var contactNumber = getElementVal('contactNumber');
  const storeLogo = document.getElementById('storeLogo').files[0];

  console.log("addStorejs");
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


//store all the values into the database
const SaveDetailsToDB = (storeName, storeAddress, email, contactNumber, logoUrl) => {
  var newAddStoreForm = ResQFeastDB.push();

  newAddStoreForm.set({
    storeName: storeName,
    storeAddress: storeAddress,
    email: email,
    contactNumber: contactNumber,
    storeLogo: logoUrl // Include logo URL in the database entry
  });
}

//get value of all the fields in the form
const getElementVal = (id) => {
  return document.getElementById(id).value;
}