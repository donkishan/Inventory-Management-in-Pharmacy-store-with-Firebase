
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

// Initialize Firebase app and database
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();



// Function to submit form data
function submitForm() {
    var selectedItem = document.getElementById('store-item').value;
    var itemDetails = "";

    if (selectedItem === 'table') {
        var tableName = document.getElementById('table-name').value;
        var tableFloors = parseInt(document.getElementById('table-floors').value);
        var tableSections = parseInt(document.getElementById('table-sections').value);
        itemDetails = "Table Name: " + tableName + ", Floors: " + tableFloors + ", Sections/Floor: " + tableSections + "<br><br>";

        // Generate default names for table cells
        itemDetails += tableName + ":" + "<br>";
        for (var r = 1; r <= tableFloors; r++) {
            for (var c = 1; c <= tableSections; c++) {
                var sectionName = tableName + " F" + r + "S" + c;
                itemDetails += sectionName + "<br>";

                // Save each floor-section in Firebase
                const path = `medical_store/tables/${tableName}/F${r}S${c}`;
                firebase.database().ref(path).set(sectionName)
                    .then(() => console.log(sectionName + ' set successfully in Firebase'))
                    .catch((error) => console.error('Error storing ' + sectionName + ':', error));
            }
        }

    } else if (selectedItem === 'rack') {
        var rackName = document.getElementById('rack-name').value;
        var rackRows = parseInt(document.getElementById('rack-rows').value);
        var rackColumns = parseInt(document.getElementById('rack-columns').value);
        itemDetails = "Rack Name: " + rackName + ", Rows: " + rackRows + ", Columns: " + rackColumns + "<br><br>";

        // Generate default names for rack cells
        itemDetails += rackName + ":" + "<br>";
        for (var r = 1; r <= rackRows; r++) {
            for (var c = 1; c <= rackColumns; c++) {
                var cellName = rackName + " R" + r + "C" + c;
                itemDetails += cellName + "<br>";

                // Save each row-column in Firebase
                const path = `medical_store/racks/${rackName}/R${r}C${c}`;
                firebase.database().ref(path).set(cellName)
                    .then(() => console.log(cellName + ' set successfully in Firebase'))
                    .catch((error) => console.error('Error storing ' + cellName + ':', error));
            }
        }

    } else if (selectedItem === 'drawer') {
        var drawerName = document.getElementById('drawer-name').value;
        itemDetails = "Drawer Name: " + drawerName + "<br><br>";

        // Save drawer name in Firebase
        const path = `medical_store/drawers/${drawerName}`;
        firebase.database().ref(path).set(drawerName)
            .then(() => console.log(drawerName + ' set successfully in Firebase'))
            .catch((error) => console.error('Error storing ' + drawerName + ':', error));

    } else if (selectedItem === 'refrigerator') {
        var refrigeratorName = document.getElementById('refrigerator-name').value;
        var refrigeratorFloors = parseInt(document.getElementById('refrigerator-floors').value);
        itemDetails = "Refrigerator Name: " + refrigeratorName + ", Floors: " + refrigeratorFloors + "<br><br>";

        // Generate default names for refrigerator cells
        itemDetails += refrigeratorName + ":" + "<br>";
        for (var r = 1; r <= refrigeratorFloors; r++) {
            var sectionName = refrigeratorName + " F" + r;
            itemDetails += sectionName + "<br>";

            // Save refrigerator floors in Firebase
            const path = `medical_store/refrigerators/${refrigeratorName}/F${r}`;
            firebase.database().ref(path).set(sectionName)
                .then(() => console.log(sectionName + ' set successfully in Firebase'))
                .catch((error) => console.error('Error storing ' + sectionName + ':', error));
        }

    } else if (selectedItem === 'others') {
        var otherItem = document.getElementById('other-item').value;
        itemDetails = "Other Item: " + otherItem + "<br><br>";

        // Save other item in Firebase
        const path = `medical_store/others/${otherItem}`;
        firebase.database().ref(path).set(otherItem)
            .then(() => console.log(otherItem + ' set successfully in Firebase'))
            .catch((error) => console.error('Error storing ' + otherItem + ':', error));
    }

    // Display entered details in output section
    document.getElementById('output').innerHTML = "<h3>Entered Details:</h3><p>" + itemDetails + "</p>";

    // Reset to default values
    resetForm();
}

