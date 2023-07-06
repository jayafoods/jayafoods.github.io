// ==========================
// Search functionality
// ==========================

const placeholders = {
  en: "Search items...",
  te: "శోధించండి..."
};

function setPlaceholderText(language) {
  var searchInput = document.getElementById('search-input');
  if (!searchInput) {
    console.error('Search input not found!');
    return;
  }
  
  var placeholderText = placeholders[language] || placeholders['en'];
  searchInput.setAttribute('placeholder', placeholderText);
}

function getSelectedLanguage() {
  const languageDropdown = document.getElementById('language');
  return languageDropdown ? languageDropdown.value : 'en';
}

// Define the input event listener as a named function
function handleSearchInput() {
  let searchQuery = this.value.toLowerCase();

  let items = document.querySelectorAll('.text-menu .item-list .item');

  const searchResultsContainer = document.getElementById('search-results');
  const searchResultsItemsContainer = document.getElementById('search-results-items');
  const searchResultsTopbar = document.querySelector('.search-results-topbar');

  // Clear the search results container before appending new content
  while (searchResultsItemsContainer.firstChild) {
    searchResultsItemsContainer.removeChild(searchResultsItemsContainer.firstChild);
  }

  let hasResults = false; // Track if there are any search results

  items.forEach(function (item) {
    let itemText = item.textContent.toLowerCase();
    if (itemText.includes(searchQuery)) {
      const listItem = document.createElement('li');
      
      const spanItem = document.createElement('span');
      spanItem.textContent = itemText.replace('➕', '');
      spanItem.className = 'item-text';
      
      listItem.appendChild(spanItem);
      searchResultsItemsContainer.appendChild(listItem);
      hasResults = true;
    }
  });  

  // Add or remove CSS classes to show or hide the search results container and its top bar
  if (searchQuery.trim() !== '') {
    if (hasResults) {
      searchResultsContainer.classList.add('show');
      searchResultsContainer.classList.add('has-results');
      searchResultsContainer.classList.remove('hide');
      searchResultsTopbar.classList.add('show');
    } else {
      searchResultsContainer.classList.remove('show');
      searchResultsContainer.classList.remove('has-results');
      searchResultsContainer.classList.add('hide');
      searchResultsTopbar.classList.remove('show');
    }
  } else {
    searchResultsContainer.classList.remove('show');
    searchResultsContainer.classList.remove('has-results');
    searchResultsContainer.classList.add('hide');
    searchResultsTopbar.classList.remove('show');
  }
}

// Attach the input event listener to the search input
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', handleSearchInput);

// Copy button in Search Results container
const copySearchButton = document.getElementById('copy-search-button');
copySearchButton.addEventListener('click', function () {
  const searchResultsList = document.querySelectorAll('#search-results-items li');
  const searchResultsText = Array.from(searchResultsList).map((item) => item.textContent).join('\n');
  navigator.clipboard.writeText(searchResultsText)
    .then(() => {
      alert('Search results copied to clipboard');
    })
    .catch((error) => {
      console.error('Could not copy search results: ', error);
    });
});

// Clear button in Search Results container
const clearSearchButton = document.getElementById('clear-search-button');
clearSearchButton.addEventListener('click', function () {
  searchInput.value = ''; // Clear the search input text

  const searchResultsContainer = document.getElementById('search-results');
  const searchResultsItemsContainer = document.getElementById('search-results-items');
  const searchResultsTopbar = document.querySelector('.search-results-topbar');

  searchResultsItemsContainer.innerHTML = '';

  searchResultsContainer.classList.remove('show');
  searchResultsContainer.classList.remove('has-results');
  searchResultsContainer.classList.add('hide');

  searchResultsTopbar.classList.remove('show');
});

window.addEventListener('resize', adjustPaddingTop);
window.addEventListener('DOMContentLoaded', adjustPaddingTop);

function adjustPaddingTop() {
  const searchResultsTopbar = document.querySelector('.search-results-topbar');
  const searchResultsItemsContainer = document.getElementById('search-results-items');
  
  const topbarHeight = searchResultsTopbar.offsetHeight;
  
  searchResultsItemsContainer.style.paddingTop = `${topbarHeight}px`;
}

// ==========================
// Shopping list functions
// ==========================

let shoppingList = [];

// Load shopping list from localStorage on page load
window.addEventListener('DOMContentLoaded', loadShoppingList);

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

// Here, we connect the clearShoppingList function to a button.
// Note: You have to set an ID of "clear-button" to the button in your HTML.
document.getElementById('clear-button').addEventListener('click', clearShoppingList);
function clearShoppingList() {
  shoppingList.length = 0; // This will clear the array
  displayShoppingList(); // Update the displayed shopping list
  hideShoppingList(); // Hide the shopping list
  saveShoppingList(); // Save the shopping list to localStorage  
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
  if (shoppingList.length === 0) { // Only hide if the list is empty
    hideShoppingListContainer();
  }
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
  saveShoppingList(); // Save the shopping list to localStorage
}

function addToShoppingList(item) {
  if (!shoppingList.includes(item)) {
    shoppingList.push(item);
    displayShoppingList();
    saveShoppingList();
  }
}

function saveShoppingList() {
  try {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

function loadShoppingList() {
  const savedList = localStorage.getItem('shoppingList');
  if (savedList) {
    try {
      shoppingList = JSON.parse(savedList);
      if (shoppingList.length > 0) { // If there is data in the shopping list
        displayShoppingList();
        showShoppingListContainer(); // Show the shopping list
      }
    } catch (e) {
      console.error("Error reading shopping list from localStorage:", e);
    }
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
        saveShoppingList(); // Save the shopping list to localStorage
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
  const textMenuContainer = document.getElementById('text-menu');

  // Clear the textMenuContainer before appending new content
  while (textMenuContainer.firstChild) {
    textMenuContainer.removeChild(textMenuContainer.firstChild);
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
        textMenuContainer.appendChild(categoryDiv);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function loadMenuCards(language) {
  const mainPaneContainer = document.getElementById('main-pane');

  // Clear the mainPaneContainer before appending new content
  while (mainPaneContainer.firstChild) {
    mainPaneContainer.removeChild(mainPaneContainer.firstChild);
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

        mainPaneContainer.appendChild(card);
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
  setPlaceholderText(language);
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
    setPlaceholderText(getSelectedLanguage());

    languageDropdown.addEventListener('change', function() {
      loadLanguage(this.value);
    });

    const copyButton = document.getElementById('copy-button');
    const clearButton = document.getElementById('clear-button');

    copyButton.addEventListener('click', copyToClipboard);
    clearButton.addEventListener('click', clearShoppingList);
  } else {
    console.error('Language dropdown not found!');
  }
});
