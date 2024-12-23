const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemlist = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;


function displayItems() {
    const itemsFromStorge = getItemFromStorage();
    itemsFromStorge.forEach((item) => addItemToDOM
        (item));
    checkUI();
}




function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemlist.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }
    }


    addItemToDOM(newItem);

    addItemToStorage(newItem);

    checkUI();
    
    itemInput.value = '';
}







function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemlist.appendChild(li);
}



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
    let itemsFromStorage = getItemFromStorage();

    itemsFromStorage.push(item);

    //convert to json string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}



function getItemFromStorage() {
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage; 
}



function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}


function checkIfItemExists(item) {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}




function setItemToEdit(item) {
    isEditMode = true;

    itemlist
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));
    
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}




function removeItem(item) {
    
    if (confirm('Are you sure?')) {
            
            item.remove();

            removeItemFromStorage(item.textContent);
            
            checkUI();
        }   
}


function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    console.log(itemsFromStorage);

     localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}



function clearItems() {
    while (itemlist.firstChild) {
        itemlist.removeChild(itemlist.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
}




function filterItems(e) {
    const items = itemlist.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    
    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1){
            item.style.display = 'flex';
            
        } else {
            item.style.display = 'none';
        }

    });
}



function checkUI() {

    itemInput.value = '';

    const items = itemlist.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }


    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
    
}


function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemlist.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems)
    
    checkUI();  
}


init();
