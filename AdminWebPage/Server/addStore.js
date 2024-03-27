import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig.js'; // Assuming firebaseConfig.js is in the same directory
//import { initializeApp } from 'firebase/compat/app'; // Assuming firebase@compat is installed

initializeApp(firebaseConfig);


document.getElementById('addStoreForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission
  
  const storeName = document.getElementById('storeName').value;
  const storeAddress = document.getElementById('storeAddress').value;
  const email = document.getElementById('email').value;
  const contactNumber = document.getElementById('contactNumber').value;
  const storeLogo = document.getElementById('storeLogo').files[0];

  const database = firebase.database();
  const storesRef = database.ref('stores');
  const maxIdsRef = database.ref('max_ids');

  maxIdsRef.transaction(function(maxIds) {
    if (maxIds) {
      maxIds.storeId = (maxIds.storeId || 0) + 1;
      maxIds.storeHistoryId = (maxIds.storeHistoryId || 0) + 1;
    } else {
      maxIds = {
        storeId: 1,
        storeHistoryId: 1
      };
    }
    return maxIds;
  }, function(error, committed, snapshot) {
    if (error) {
      console.error('Transaction failed abnormally!', error);
      alert('An error occurred while adding the store. Please try again.');
    } else if (!committed) {
      console.log('Transaction aborted.');
    } else {
      console.log('Transaction successfully committed:', snapshot.val());

      const { storeId, storeHistoryId } = snapshot.val();

      const storeData = {
        storeId: storeId,
        storeName: storeName,
        storeAddress: storeAddress,
        email: email,
        contactNumber: contactNumber
        // Add other fields as needed
      };

      const newStoreRef = storesRef.push();
      newStoreRef.set(storeData)
        .then(() => {
          alert('Store added successfully!');
          document.getElementById('addStoreForm').reset(); // Reset form after successful submission
        })
        .catch(error => {
          console.error('Error adding store:', error);
          alert('An error occurred while adding the store. Please try again.');
        });
    }
  });
});
