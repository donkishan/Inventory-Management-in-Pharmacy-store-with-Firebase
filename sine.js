
    const firebaseConfig = {
        apiKey: "AIzaSyC2n82yjAljSCTjTAy3p8IsaYvx-bo2ePI",
        authDomain: "medical-a70b0.firebaseapp.com",
        databaseURL: "https://medical-a70b0-default-rtdb.firebaseio.com",
        projectId: "medical-a70b0",
        storageBucket: "medical-a70b0.appspot.com",
        messagingSenderId: "405220474341",
        appId: "1:405220474341:web:f1e792db059f08c76ac30c",
        measurementId: "G-JSH167JC8J"
    };

    // Initialize Firebase app
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Function to populate location dropdown from Firebase
    function populateLocationDropdown() {
        const locationDropdown = document.getElementById('location');
        locationDropdown.innerHTML = '<option value="">Select Location</option>'; // Clear previous options

        // Fetch tables
        const tablesRef = database.ref('medical_store/tables');
        tablesRef.once('value', (snapshot) => {
            snapshot.forEach((tableSnapshot) => {
                const tableName = tableSnapshot.key; // Get the table name
                tableSnapshot.forEach((locationSnapshot) => {
                    const locationName = locationSnapshot.val(); // Get the location value
                    if (locationName) { // Check if locationName is not null
                        const option = document.createElement('option');
                        option.value = locationName; // Use the location name as value
                        option.textContent = locationName; // Display name in the dropdown
                        locationDropdown.appendChild(option);
                    }
                });
            });
        }).catch((error) => console.error('Error fetching tables:', error));

        // Fetch racks
        const racksRef = database.ref('medical_store/racks');
        racksRef.once('value', (snapshot) => {
            snapshot.forEach((rackSnapshot) => {
                const rackName = rackSnapshot.key; // Get the rack name
                rackSnapshot.forEach((locationSnapshot) => {
                    const locationName = locationSnapshot.val(); // Get the location value
                    if (locationName) { // Check if locationName is not null
                        const option = document.createElement('option');
                        option.value = locationName; // Use the location name as value
                        option.textContent = locationName; // Display name in the dropdown
                        locationDropdown.appendChild(option);
                    }
                });
            });
        }).catch((error) => console.error('Error fetching racks:', error));

        // Fetch drawers
        const drawersRef = database.ref('medical_store/drawers');
        drawersRef.once('value', (snapshot) => {
            snapshot.forEach((drawerSnapshot) => {
                const drawerName = drawerSnapshot.key; // Get the drawer name
                const option = document.createElement('option');
                option.value = drawerName; // Use the drawer name as value
                option.textContent = drawerName; // Display name in the dropdown
                locationDropdown.appendChild(option);
            });
        }).catch((error) => console.error('Error fetching drawers:', error));

        // Fetch refrigerators
        const refrigeratorsRef = database.ref('medical_store/refrigerators');
        refrigeratorsRef.once('value', (snapshot) => {
            snapshot.forEach((fridgeSnapshot) => {
                const fridgeName = fridgeSnapshot.key; // Get the refrigerator name
                fridgeSnapshot.forEach((locationSnapshot) => {
                    const locationName = locationSnapshot.val(); // Get the location value
                    if (locationName) { // Check if locationName is not null
                        const option = document.createElement('option');
                        option.value = locationName; // Use the location name as value
                        option.textContent = locationName; // Display name in the dropdown
                        locationDropdown.appendChild(option);
                    }
                });
            });
        }).catch((error) => console.error('Error fetching refrigerators:', error));
    }

    // Function to handle form submission and update stock
    // Function to handle form submission and update stock
function handleFormSubmission() {
    const inventoryForm = document.getElementById('inventoryForm');
    inventoryForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get values from the input fields
        const medicationName = document.getElementById('medName').value; // Updated ID
        const quantity = parseInt(document.getElementById('quantity').value);
        const location = document.getElementById('location').value;
        const expiryDate = document.getElementById('expiryDate').value; // Updated ID

        console.log('Medication Name:', medicationName);
        console.log('Quantity:', quantity);
        console.log('Location:', location);
        console.log('Expiry Date:', expiryDate);

        // Update the stock in Firebase
        const inventoryRef = database.ref(`medical_store/inventory/${medicationName}`);
        inventoryRef.once('value', (snapshot) => {
            if (snapshot.exists()) {
                // Medication exists, update the quantity and expiry date
                const currentQuantity = snapshot.val().quantity || 0;
                const newQuantity = currentQuantity + quantity; // Increment the quantity
                inventoryRef.update({
                    quantity: newQuantity,
                    location: location,
                    expiryDate: expiryDate
                }).then(() => {
                    console.log('Stock updated successfully!');
                    fetchCurrentInventory(); // Refresh the inventory display
                }).catch((error) => console.error('Error updating stock:', error));
            } else {
                // Medication doesn't exist, create a new record
                inventoryRef.set({
                    quantity: quantity,
                    location: location,
                    expiryDate: expiryDate
                }).then(() => {
                    console.log('New medication added successfully!');
                    fetchCurrentInventory(); // Refresh the inventory display
                }).catch((error) => console.error('Error adding medication:', error));
            }
        });
    });
}

    // Function to fetch current inventory from Firebase and display it
    function fetchCurrentInventory() {
        const inventoryTableBody = document.getElementById('inventoryTable').querySelector('tbody');
        inventoryTableBody.innerHTML = ''; // Clear existing rows

        const inventoryRef = database.ref('medical_store/inventory');
        inventoryRef.once('value', (snapshot) => {
            snapshot.forEach((medicationSnapshot) => {
                const medicationData = medicationSnapshot.val();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${medicationSnapshot.key}</td>
                    <td>${medicationData.quantity}</td>
                    <td>${medicationData.location}</td>
                    <td>${medicationData.expiryDate}</td>
                    <td>
                        <button onclick="editMedication('${medicationSnapshot.key}')">Edit</button>
                        <button onclick="deleteMedication('${medicationSnapshot.key}')">Delete</button>
                    </td>
                `;
                inventoryTableBody.appendChild(row);
            });
        });
    }

    // Call the function to populate dropdown and handle form submission when the page loads
    document.addEventListener("DOMContentLoaded", function() {
        populateLocationDropdown(); // Populate dropdown with locations
        fetchCurrentInventory(); // Display the current inventory
        handleFormSubmission(); // Handle form submission
    });

    // Example function for editing medication
    function editMedication(medicationName) {
        const inventoryRef = database.ref(`medical_store/inventory/${medicationName}`);
        inventoryRef.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const medicationData = snapshot.val();
                document.getElementById('medication-name').value = medicationName;
                document.getElementById('quantity').value = medicationData.quantity;
                document.getElementById('location').value = medicationData.location;
                document.getElementById('expiry-date').value = medicationData.expiryDate;
            }
        });
    }

    // Example function for deleting medication
    function deleteMedication(medicationName) {
        const inventoryRef = database.ref(`medical_store/inventory/${medicationName}`);
        inventoryRef.remove()
            .then(() => {
                console.log('Medication deleted successfully!');
                fetchCurrentInventory(); // Refresh the inventory display
            })
            .catch((error) => console.error('Error deleting medication:', error));
    }


