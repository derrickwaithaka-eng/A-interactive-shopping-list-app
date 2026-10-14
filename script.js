// Select DOM elements
const itemInput = document.getElementById('item-input');
const priceInput = document.getElementById('price-input');
const addBtn = document.getElementById('add-btn');
const shoppingListEl = document.getElementById('shopping-list');
const totalCostEl = document.getElementById('total-cost');
const clearBtn = document.getElementById('clear-btn');

// Initialize array from LocalStorage or empty array (Persistence feature)
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

// Save state to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Render the list on the webpage
function renderList() {
    shoppingListEl.innerHTML = '';
    let totalCost = 0;

    shoppingList.forEach((item, index) => {
        totalCost += item.price;

        const li = document.createElement('li');
        if (item.purchased) {
            li.classList.add('purchased');
        }

        li.innerHTML = `
            <span class="item-details" onclick="togglePurchased(${index})">
                <strong>${item.name}</strong> - $${item.price.toFixed(2)}
            </span>
            <div class="item-actions">
                <button class="edit-btn" onclick="editItem(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${index})">X</button>
            </div>
        `;
        shoppingListEl.appendChild(li);
    });

    totalCostEl.textContent = totalCost.toFixed(2);
    saveToLocalStorage();
}

// Add Item Event Listener
addBtn.addEventListener('click', () => {
    const name = itemInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (name === '' || isNaN(price) || price < 0) {
        alert('Please enter a valid item name and price.');
        return;
    }

    shoppingList.push({
        name: name,
        price: price,
        purchased: false
    });

    itemInput.value = '';
    priceInput.value = '';
    renderList();
});

// Toggle Purchased Status (Strikethrough)
function togglePurchased(index) {
    shoppingList[index].purchased = !shoppingList[index].purchased;
    renderList();
}

// Edit Existing Item Feature
function editItem(index) {
    const item = shoppingList[index];
    const newName = prompt('Edit item name:', item.name);
    if (newName === null) return; // Cancelled

    const newPriceStr = prompt('Edit item price:', item.price);
    if (newPriceStr === null) return; // Cancelled

    const newPrice = parseFloat(newPriceStr);

    if (newName.trim() !== '' && !isNaN(newPrice) && newPrice >= 0) {
        shoppingList[index].name = newName.trim();
        shoppingList[index].price = newPrice;
        renderList();
    } else {
        alert('Invalid input. Changes not saved.');
    }
}

// Delete Single Item
function deleteItem(index) {
    shoppingList.splice(index, 1);
    renderList();
}

// Clear Entire List Button Event Listener
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire list?')) {
        shoppingList = [];
        renderList();
    }
});

// Initial render when the page loads
renderList();