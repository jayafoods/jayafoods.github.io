// ==========================
// Search functionality
// ==========================

document.getElementById('search-input').addEventListener('keyup', function() {
  let searchQuery = this.value.toLowerCase();

  let items = document.querySelectorAll('.text-menu .item-list .item');

  const searchResultsContainer = document.getElementById('search-results');
  const searchResultsItemsContainer = document.getElementById('search-results-items');

  // Clear the search results container before appending new content
  while (searchResultsItemsContainer.firstChild) {
    searchResultsItemsContainer.removeChild(searchResultsItemsContainer.firstChild);
  }

  if (searchQuery.trim() !== '') {
    let hasResults = false; // Track if there are any search results

    items.forEach(function(item) {
      let itemText = item.textContent.toLowerCase();
      if (itemText.indexOf(searchQuery) !== -1) {
        const listItem = document.createElement('li');
        listItem.textContent = itemText.replace('➕', '');
        searchResultsItemsContainer.appendChild(listItem);
        hasResults = true;
      }
    });

    if (hasResults) {
      searchResultsContainer.style.display = 'block';
    } else {
      searchResultsContainer.style.display = 'none';
    }
  } else {
    searchResultsContainer.style.display = 'none';
  }
});

// Copy button in Search Results container
const copySearchButton = document.getElementById('copy-search-button');
copySearchButton.addEventListener('click', function() {
  const searchResultsList = document.querySelectorAll('#search-results-items li');
  const searchResultsText = Array.from(searchResultsList).map(item => item.textContent).join('\n');
  navigator.clipboard.writeText(searchResultsText)
    .then(() => {
      alert('Search results copied to clipboard');
    })
    .catch(err => {
      console.error('Could not copy search results: ', err);
    });
});

// Clear button in Search Results container
const clearSearchButton = document.getElementById('clear-search-button');
clearSearchButton.addEventListener('click', function() {
  const searchInput = document.getElementById('search-input');
  searchInput.value = ''; // Clear the search input text

  const searchResultsContainer = document.getElementById('search-results');
  const searchResultsItemsContainer = document.getElementById('search-results-items');
  searchResultsItemsContainer.innerHTML = '';
  searchResultsContainer.style.display = 'none';
});


// ==========================
// Shopping list functions
// ==========================

let shoppingList = [];

function copyToClipboard() {
  const copyText = shoppingList.map(item => `- ${item}`).join('\n');
  navigator.clipboard.writeText(copyText)
    .then(() => {
      alert('Shopping list copied to clipboard');
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
    });
}

function clearShoppingList() {
  shoppingList.length = 0; // This will clear the array
  displayShoppingList(); // Update the displayed shopping list
  hideShoppingList(); // Hide the shopping list
}

function showShoppingListContainer() {
  const container = document.getElementById('shopping-list');
  container.style.display = 'block';
}

function hideShoppingListContainer() {
  const container = document.getElementById('shopping-list');
  container.style.display = 'none';
}

function showShoppingList() {
  displayShoppingList();
  showShoppingListContainer();
}

function hideShoppingList() {
  hideShoppingListContainer();
}

function toggleInShoppingList(item) {
  const index = shoppingList.indexOf(item);
  if (index > -1) {
    // If the item is in the shopping list, remove it
    shoppingList.splice(index, 1);
  } else {
    // If the item does not exist in the shopping list, add it
    shoppingList.push(item);
  }

  // Update the displayed shopping list
  displayShoppingList();
}

function addToShoppingList(item) {
  const index = shoppingList.indexOf(item);
  if (index === -1) {
    // If the item does not exist in the shopping list, add it
    shoppingList.push(item);
  }

  // Update the displayed shopping list
  displayShoppingList();
}

function saveShoppingList() {
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

function loadShoppingList() {
  const savedList = localStorage.getItem('shoppingList');
  if (savedList) {
    shoppingList = JSON.parse(savedList);
  }
}

function displayShoppingList() {
  const shoppingListContainer = document.getElementById('shopping-list');
  const shoppingListItemsContainer = document.getElementById('shopping-list-items');

  // Clear the shopping list items container
  while (shoppingListItemsContainer.firstChild) {
    shoppingListItemsContainer.removeChild(shoppingListItemsContainer.firstChild);
  }

  if (shoppingList.length > 0) {
    const itemList = document.createElement('ul');
    itemList.className = 'item-list';

    shoppingList.forEach(item => {
      const listItem = document.createElement('li');

      const itemText = document.createElement('span');
      itemText.className = 'item-text';
      itemText.textContent = item;
      listItem.appendChild(itemText);

      const removeButton = document.createElement('button');
      removeButton.textContent = '  ➖';
      removeButton.style.color = "#dc3545";
      removeButton.onclick = () => {
        toggleInShoppingList(item);
      };

      listItem.appendChild(removeButton);
      itemList.appendChild(listItem);
    });

    shoppingListItemsContainer.appendChild(itemList);
    shoppingListContainer.style.display = 'block';
  } else {
    shoppingListContainer.style.display = 'none';
  }
}

// ====================================================
// Menu handling functions for text-menu and photo-menu
// ====================================================

function loadTextMenu(language) {
  const textMenuPane = document.getElementById('text-menu');

  // Clear the textMenuPane before appending new content
  while (textMenuPane.firstChild) {
    textMenuPane.removeChild(textMenuPane.firstChild);
  }

  const jsonFile = 'data/text-menu.json';

  fetch(jsonFile)
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      return response.json();
    })
    .then(jsonData => {
      for (let category in jsonData) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = `category category-${category.toLowerCase()}`;

        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = jsonData[category][language].title; 
        categoryDiv.appendChild(categoryTitle);

        const itemList = document.createElement('ul');
        itemList.className = 'item-list';

        const items = jsonData[category][language].items; 
        for (let item of items) {
          const listItem = document.createElement('li');
          listItem.className = 'item';
          listItem.textContent = item.name; 

          const addButton = document.createElement('button');
          addButton.className = 'add-button';
          addButton.textContent = '➕';
          addButton.onclick = function () {
            addToShoppingList(item.name); // Push the item name to the shoppingList array
            displayShoppingList(); // Update the displayed shopping list
          };

          listItem.appendChild(addButton);

          if (item.spiciness > 0) {
            const pepperIcon = document.createElement('span');
            pepperIcon.className = 'spicy-icon';
            pepperIcon.textContent = '🌶️'.repeat(item.spiciness); 
            listItem.insertBefore(pepperIcon, listItem.firstChild); 
          } else {
            const dotIcon = document.createElement('span');
            dotIcon.className = 'dot-icon';
            dotIcon.textContent = '•'; 
            listItem.insertBefore(dotIcon, listItem.firstChild); 
          }

          itemList.appendChild(listItem);
        }

        categoryDiv.appendChild(itemList);
        textMenuPane.appendChild(categoryDiv);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


var languageDropdown = document.getElementById('language');
if (languageDropdown) {
  var language = languageDropdown.value;
  document.querySelectorAll('.lang-' + language).forEach(function(element) {
    element.style.display = '';
  });
}

function loadMenuCards(language) {
  const mainPane = document.getElementById('main-pane');

  // Clear the mainPane before appending new content
  while (mainPane.firstChild) {
    mainPane.removeChild(mainPane.firstChild);
  }

  const jsonFile = 'data/photo-menu.json';

  fetch(jsonFile)
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      return response.json();
    })
    .then(jsonData => {
      const menuItems = jsonData;

      menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';

        // Create the <img> element
        var imageElement = document.createElement('img');
        imageElement.src = item.DishImage.medium;
        imageElement.srcset = `
          ${item.DishImage.small} 500w, 
          ${item.DishImage.medium} 1000w, 
          ${item.DishImage.large} 1500w`;
        imageElement.sizes = '(max-width: 600px) 500px, (min-width: 601px) 1000px, 1500px';
        card.appendChild(imageElement);

        const name = document.createElement('h2');
        name.textContent = item.DishName[language];
        card.appendChild(name);

        const description = document.createElement('p');
        description.textContent = item.DishDescription[language];
        card.appendChild(description);

        mainPane.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// ==========================
// Language handling functions
// ==========================

function loadLanguage(language) {
  var elements = document.querySelectorAll('.lang-en, .lang-te');
  elements.forEach(function(element) {
    element.style.display = 'none';
  });
  document.querySelectorAll('.lang-' + language).forEach(function(element) {
    element.style.display = '';
  });

  localStorage.setItem('selectedLanguage', language);

  loadTextMenu(language);
  loadMenuCards(language);
}

// Other language handling functions...

// ==========================
// DOMContentLoaded event
// ==========================

window.addEventListener('DOMContentLoaded', function() {
  loadShoppingList();
  var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

  var languageDropdown = document.getElementById('language');
  if (languageDropdown) {
    languageDropdown.value = selectedLanguage;
    loadLanguage(selectedLanguage);

    languageDropdown.onchange = function() {
      loadLanguage(this.value);
    };

    const copyButton = document.getElementById('copy-button');
    const clearButton = document.getElementById('clear-button');

    copyButton.addEventListener('click', copyToClipboard);
    clearButton.addEventListener('click', clearShoppingList);
  } else {
    console.error('Language dropdown not found!');
  }
});