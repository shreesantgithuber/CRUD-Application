
const newItemInput = document.getElementById('newItem');
const createBtn = document.getElementById('createBtn');
const itemList = document.getElementById('itemList');
const updateSection = document.querySelector('.update-section');
const updateIdInput = document.getElementById('updateId');
const updateNameInput = document.getElementById('updateName');
const updateBtn = document.getElementById('updateBtn');
const cancelUpdateBtn = document.getElementById('cancelBtn');

let items = [];
let currentUpdateId = null;

async function fetchItems() {
    try {
        const response = await fetch('api/items');
        const fetchedItems = await response.json();
        items = fetchedItems;
        renderItems();
    } catch (error) {
        console.log("Error fetching items ", error);
    }
}

// Function to render items in the list 

function renderItems() {
    itemList.innerHTML = '';
    items.forEach((item, ind) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span> ${item.name} (ID: ${item.id}) </span>
            <div class="item-actions"> 
                <button class="update-item-btn" data-id="${item.id}"> Update </button>
                <button class="delete-btn" data-id="${item.id}"> Delete </button>
            </div>
        `;
        itemList.appendChild(listItem);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteItem);
    })

    document.querySelectorAll('.update-item-btn').forEach(button => {
        button.addEventListener('click', showUpdateForm);
    })
}


async function createNewElement() {
    const itemName = newItemInput.value.trim();
    if (itemName) {
        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: itemName })
            });
            const newItem = await response.json();
            items.push(newItem);
            renderItems();
            newItemInput.value = '';
        } catch (error) {
            console.log(`Error while creating item ${error}`);
        }
    }
}


function showUpdateForm(event) {
    const itemId = event.target.dataset.id;
    console.log("item id ", itemId)
    const itemToUpdate = items.find(item => item.id === parseInt(itemId));
    if (itemToUpdate) {
        currentUpdateId = itemId;
        updateIdInput.value = itemId;
        updateNameInput.value = itemToUpdate.name;
        updateSection.style.display = 'block';
    }
}


async function updateItem() {
    const updatedName = updateNameInput.value.trim();
    console.log("updated name ", updateName);
    if (updateName && currentUpdateId) {
        try {
            const response = await fetch(`/api/items/${currentUpdateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: updatedName
                }),
            });
            
            console.log("updated response ", response)
            if (response.ok) {
                const updatedItem = await response.json();
                items = items.map(item => (item.id === updatedItem.id ? updatedItem : item));
                renderItems();
                hideUpdateForm();
            } else {
                console.log("Failed to update item");
            }
        } catch (error) {
            console.log("Error while updating item ", error);
        }
    }
}


async function deleteItem(event) {
    const itemId = event.target.dataset.id;
    try {
        const response = await fetch(`/api/items/${itemId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            items = items.filter(item => item.id !== parseInt(itemId));
            renderItems();
        } else {
            console.log('Failed to delete item ');
        }
    } catch (error) {
        console.log(`Error while deleting item ${error}`);
    }
}


function hideUpdateForm() {
    updateSection.style.display = 'none';
    currentUpdateId.value = '';
    updateNameInput.value = '';
}

createBtn.addEventListener('click', createNewElement);
cancelUpdateBtn.addEventListener('click', hideUpdateForm);
updateBtn.addEventListener('click', updateItem);

fetchItems();