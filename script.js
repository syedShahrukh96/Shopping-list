const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}


function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    //validate input
    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    //check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('that item already exists!');
            return;
        }
    }


    //create item DOM element
    addItemToDOM(newItem);

    //Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    //take iteminput
    itemInput.value = '';
}

function addItemToDOM(item) {
        //create list item if the input is valid.
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(item));
    
        const button = createButton('remove-item btn-link text-red');
        li.appendChild(button);
    
        //add li to DOM
        itemList.appendChild(li);
}




//create button functions
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;

}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

  
    //add new item in array
    itemsFromStorage.push(item);
    
    //convert ot JSON String and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}


function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;

}


//remove the individual item list to remove
function removeItem(item) {
    if (confirm('Are you sure?')) {
        //Remove item from DOM
        item.remove();

        //Remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Re-set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));''
}

//remove the every thing
function clearItem() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //Clear from local storage
    localStorage.removeItem('items');

    checkUI();
}

function filterItems(e) {
    const items = document.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }

    });

}

function checkUI() {
    const items = document.querySelectorAll('li');
    
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = '<i class ="fa-solid fa-plus"></i> Add item';
    formBtn.style.backgroundColor = '#333'
    isEditMode = False;
}

//initialize app

function init() {

    //Event Listners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItem);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();