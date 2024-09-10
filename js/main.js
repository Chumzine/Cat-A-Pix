import CatList from "./catlist.js";

// Launch app
document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});


const initApp = () => {
    // Add listeners for the form
    const repoForm = document.getElementById("repoForm");
    let isUpdating = false;
    let currentItemIndex = null;

    repoForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const pictureFile = document.getElementById('file').files[0];
        const name = document.getElementById('name').value;
        const category = document.getElementById('categories').value;

        if (!pictureFile) {
            alert("Please upload an image.");
            return;
        }

        // Convert the image file to Base64
        const base64Image = await convertImageToBase64(pictureFile);
        const newItem = { picture: base64Image, name, category };

        if (isUpdating) {
            updateItem(newItem, currentItemIndex);
            refreshThePage();
        } else {
            createItem(newItem);
            displaySingleItem(newItem);  
        }

        repoForm.reset();
        isUpdating = false;
        currentItemIndex = null;
    });

    const deleteCheckedButton = document.getElementById("deleteChecked");
    deleteCheckedButton.addEventListener("click", () => {
        deleteCheckedItems();
        refreshThePage(); 
    });

    refreshThePage();  // Initial display of the repository items
};

// Convert image file to Base64
const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);  // Base64 string
        };
        reader.onerror = () => {
            reject("Error reading file");
        };
        reader.readAsDataURL(file);
    });
};

const deleteCheckedItems = () => {
    const checkedItems = document.querySelectorAll('.item-checkbox');
    checkedItems.forEach((checkbox, index) => {
        if (checkbox.checked) {
            CatList.removeItemFromList(index);
        }
    });
    saveToLocalStorage();
};

const refreshThePage = () => {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = "";  // Clear the current display

    const items = CatList.getList(); 
    items.forEach((item, index) => {
        displaySingleItem(item, index);  // Rebuild the DOM with updated items
    });
};

const displaySingleItem = (item, index) => {
    const itemList = document.getElementById("itemList");
    const li = document.createElement("li");
    
    li.innerHTML = `
        <input type="checkbox" class="item-checkbox" width="100">
        <img src="${item.picture}" alt="Cat Picture" width="90px" height="100px" />
        <p>Name: ${item.name}</p>
        <p>Category: ${item.category}</p>
        <button style="background-color: green; padding: 5px 6px; color: #fff; border-radius: 6px;" onclick="editItem(${index})">Edit</button>
        <button style="background-color: red; padding: 5px 6px; color: #fff; border-radius: 6px;" onclick="deleteItem(${index})">Delete</button><br><br>
    `;

    itemList.appendChild(li);  // Dynamically append the new item to the list
};

// Function to create an item
const createItem = (newItem) => {
    CatList.addItemToList(newItem);
    saveToLocalStorage();
};

// Function to update an item
const updateItem = (updatedItem, index) => {
    CatList.updateItemInList(updatedItem, index);
    saveToLocalStorage();
};

// Function to delete an item
const deleteItem = (index) => {
    CatList.removeItemFromList(index);
    saveToLocalStorage();
    refreshThePage();
};

// Function to edit an item
const editItem = (index) => {
    const list = CatList.getList();
    const item = list[index];

    document.getElementById('file').value = "";
    document.getElementById('name').value = item.name;
    document.getElementById('category').value = item.category;

    isUpdating = true;
    currentItemIndex = index;
};

// Function to save to update localStorage
const saveToLocalStorage = () => {
    const list = CatList.getList();
    localStorage.setItem("catList", JSON.stringify(list));
};

// Function to load from localStorage 
const loadFromLocalStorage = () => {
    const storedList = JSON.parse(localStorage.getItem("catList"));
    if (storedList) {
        storedList.forEach(item => CatList.addItemToList(item));
    }
};

// Load items when the app starts
loadFromLocalStorage();












// // Delete checked items function
// deleteCheckedBtn.addEventListener('click', () => {
//     const checkboxes = document.querySelectorAll('.item-checkbox');
//     const indicesToDelete = [];

//     checkboxes.forEach(checkbox => {
//         if (checkbox.checked) {
//             indicesToDelete.push(parseInt(checkbox.getAttribute('data-index')));
//         }
//     });

//     // Delete items in reverse order to prevent index shifting
//     indicesToDelete.sort((a, b) => b - a).forEach(index => {
//         items.splice(index, 1);
//     });

//     localStorage.setItem('items', JSON.stringify(items));
//     displayItems();
// });

// // Function to delete checked items
// const deleteCheckedItems = () => {
//     const checkboxes = document.querySelectorAll(".item-checkbox:checked");
//     const indicesToDelete = Array.from(checkboxes).map(checkbox => parseInt(checkbox.getAttribute("data-index")));

//     // Sort indices in descending order to avoid re-indexing issues during removal
//     indicesToDelete.sort((a, b) => b - a);

//     // Delete items by index
//     indicesToDelete.forEach(index => {
//         CatList.removeItemFromList(index);
//     });

//     updateLocalStorage();
//     displayList();  // Update the list view after deleting checked items
// };
