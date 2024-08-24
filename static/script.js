// script.js

document.addEventListener('DOMContentLoaded', function () {
    const itemList = document.getElementById('itemList');
    const addItemForm = document.getElementById('addItemForm');

    // Function to fetch items from backend and render them
    function getItems() {
        fetch('/items')
            .then(response => response.json())
            .then(data => {
                itemList.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${item[1]}: ${item[2]}</span>
                                    <button onclick="editItem(${item[0]})">Edit</button>
                                    <button onclick="deleteItem(${item[0]})">Delete</button>`;
                    itemList.appendChild(li);
                });
            });
    }

    // Function to add new item
    addItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('itemName').value;
        const quantity = document.getElementById('itemQuantity').value;
        fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, quantity })
        })
            .then(response => response.json())
            .then(() => {
                getItems();
                addItemForm.reset();
            });
    });

    // Function to delete item
    window.deleteItem = function (id) {
        fetch(`/items/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => {
                getItems();
            });
    };

    // Function to edit item
    window.editItem = function (id) {
        const newName = prompt('Enter new name:');
        const newQuantity = parseInt(prompt('Enter new quantity:'));
        if (newName !== null && !isNaN(newQuantity)) {
            fetch(`/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName, quantity: newQuantity })
            })
                .then(response => response.json())
                .then(() => {
                    getItems();
                });
        }
    };

    // Initial fetch to render items
    getItems();
});
