// SearchHandler.js for Pankiverse/AI-Generated recipe book - Shopping hyperlink module
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online

// Function to create and insert the store selector
function createStoreSelector() {
    const storeSelectorContainer = document.createElement('div');
    storeSelectorContainer.innerHTML = `
        <label for="store-selector">Choose a store: </label>
        <select id="store-selector">
          <option value="walmart">Walmart</option>
          <option value="kroger">Kroger</option>
          <option value="meijer">Meijer</option>
          <option value="aldi">Aldi</option>
          <option value="publix">Publix</option>
          <option value="albertsons">Albertsons</option>
          <option value="custom">Custom Store</option>
        </select>
        <div id="custom-store-fields" style="display:none;">
            <label for="custom-store-name">Custom Store Name:</label>
            <input type="text" id="custom-store-name" />
            <label for="custom-store-url">Custom Store Search URL:</label>
            <input type="text" id="custom-store-url" />
            <button id="save-custom-store">Save Custom Store</button>
            <button id="cancel-custom-store">Cancel</button>
        </div>
      `;

    // Find the first instance of "Ingredients:" and insert the store selector after it
    const ingredientsHeaders = document.querySelectorAll('h2');
    const ingredientsHeader = Array.from(ingredientsHeaders).find(el => el.textContent.trim() === 'Ingredients:');
    if (ingredientsHeader) {
        ingredientsHeader.parentNode.insertBefore(storeSelectorContainer, ingredientsHeader.nextSibling);
        console.log("Store selector inserted successfully");
    } else {
        console.error("Could not find 'Ingredients:' header");
    }

    // Show/hide custom store fields based on the selected option
    const storeSelector = document.getElementById('store-selector');
    storeSelector.addEventListener('change', (e) => {
        const customStoreFields = document.getElementById('custom-store-fields');
        if (e.target.value === 'custom') {
            customStoreFields.style.display = 'block';
        } else {
            customStoreFields.style.display = 'none';
        }
    });

    // Save custom store details to the dropdown and cookie
    const saveCustomStoreButton = document.getElementById('save-custom-store');
    saveCustomStoreButton.addEventListener('click', () => {
        const customStoreName = document.getElementById('custom-store-name').value;
        const customStoreUrl = document.getElementById('custom-store-url').value;

        // Add to dropdown
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.text = customStoreName;
        customOption.setAttribute('data-url', customStoreUrl);

        const existingCustomOption = Array.from(storeSelector.options).find(option => option.value === 'custom');
        if (existingCustomOption) {
            existingCustomOption.text = customStoreName;
            existingCustomOption.setAttribute('data-url', customStoreUrl);
        } else {
            storeSelector.add(customOption);
        }

        // Save to cookie
        setCookie('customStoreName', customStoreName, 30); // 30 days
        setCookie('customStoreUrl', customStoreUrl, 30); // 30 days
        console.log('Custom store details saved to dropdown and cookie');

        // Hide custom store fields
        const customStoreFields = document.getElementById('custom-store-fields');
        customStoreFields.style.display = 'none';
    });

    // Cancel custom store fields
    const cancelCustomStoreButton = document.getElementById('cancel-custom-store');
    cancelCustomStoreButton.addEventListener('click', () => {
        const customStoreFields = document.getElementById('custom-store-fields');
        customStoreFields.style.display = 'none';
        document.getElementById('custom-store-name').value = '';
        document.getElementById('custom-store-url').value = '';
        const storeSelector = document.getElementById('store-selector');
        storeSelector.value = 'walmart'; // Reset to default option
        console.log('Custom store fields cancelled');
    });
}

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Function to get a cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Store URLs
const storeUrls = {
    walmart: 'https://www.walmart.com/search?q=',
    kroger: 'https://www.kroger.com/search?query=',
    meijer: 'https://www.meijer.com/shopping/search.html?text=',
    aldi: 'https://new.aldi.us/results?q=',
    publix: 'https://www.publix.com/search?searchTerm=',
    albertsons: 'https://www.albertsons.com/shop/search-results.html?q=',
};

// Load custom store details from cookie if available
function loadCustomStoreDetails() {
    const customStoreName = getCookie('customStoreName');
    const customStoreUrl = getCookie('customStoreUrl');
    if (customStoreName && customStoreUrl) {
        document.getElementById('custom-store-name').value = customStoreName;
        document.getElementById('custom-store-url').value = customStoreUrl;

        // Update dropdown
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.text = customStoreName;
        customOption.setAttribute('data-url', customStoreUrl);

        const storeSelector = document.getElementById('store-selector');
        const existingCustomOption = Array.from(storeSelector.options).find(option => option.value === 'custom');
        if (existingCustomOption) {
            existingCustomOption.text = customStoreName;
            existingCustomOption.setAttribute('data-url', customStoreUrl);
        } else {
            storeSelector.add(customOption);
        }

        console.log('Loaded custom store details from cookie');
    }
}
// List of unnecessary terms to filter out
const filterTerms = [
    '1/2', '1/3', '1/4', '1/8',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', 
    '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
    'tablespoons', 'tablespoon', 
    'teaspoons', 'teaspoon', 
    'ounces', 'ounce', 
    'pounds', 'pound', 
    'grams', 'gram', 
    'milliliters', 'milliliter', 
    'liters', 'liter', 
    'fluid ounces', 'fluid ounce', 
    'cups', 'cup', '(cups)', '(cup)',
    'pints', 'pint', 
    'quarts', 'quart', 
    'gallons', 'gallon', 
    'freshly squeezed', 'squeezed', 'chopped', 'peeled', 'diced', 
    'sliced', 'minced', 'grated', 'shredded', 'crushed', 'pureed', 
    'roasted', 'boiled', 'steamed', 'fried', 'baked',
    'pinch', 'dash', 'of', 'and', 'with', 'for',
    'to taste', 'to preference', 'to desired consistency',
    'until', 'until golden brown', 'until tender', 'until cooked through',
    'until lightly browned', 'until slightly softened',
    'in a bowl', 'in a saucepan', 'in a skillet', 'in a pot', 
    'in a Dutch oven', 'over medium heat', 'over low heat', 
    'over high heat', 'in a preheated oven', 'at room temperature', 
    'at 350°F', 'at 375°F', 'at 400°F', 'at 425°F', 'at 450°F', 
    'at 500°F', 'at 550°F', 'at 600°F', 'optional', 'or', 'as needed', 
    'if desired', 'to garnish', 'for serving', 'before cooking', 
    'after cooking', 'while cooking'
];

// List of exact match terms to filter out
const exactMatchTerms = [
    /\bml\b/, /\bmg\b/, /\bg\b/, /\bL\b/, /\bcm\b/,
    /\btbsp\b/, /\btsp\b/, /\boz\b/, /\blb\b/,
    /\bfl oz\b/, /\bcup\b/, /\bpt\b/, /\bqt\b/, /\bgal\b/
];

// Function to filter ingredient text
function filterIngredientText(text) {
    let filteredText = text.toLowerCase();
    filterTerms.forEach(term => {
        filteredText = filteredText.replace(new RegExp(`\\b${term}\\b`, 'g'), '').trim();
    });
    exactMatchTerms.forEach(term => {
        filteredText = filteredText.replace(term, '').trim();
    });
    return filteredText;
}

// Function to update links
function updateLinks(store) {
    try {
        const ingredientLists = document.querySelectorAll('.ingredients ul');
        if (ingredientLists.length === 0) {
            throw new Error("No ingredient lists found with selector '.ingredients ul'");
        }
        ingredientLists.forEach(list => {
            const ingredients = list.querySelectorAll('li');
            ingredients.forEach(ingredient => {
                const originalText = ingredient.textContent.trim();
                const filteredText = filterIngredientText(originalText);
                const encodedText = encodeURIComponent(filteredText);
                // Only create a link if there's meaningful text left after filtering
                if (filteredText) {
                    const link = document.createElement('a');
                    let url;
                    if (store === 'custom') {
                        const customStoreUrl = getCookie('customStoreUrl');
                        if (customStoreUrl) {
                            url = `${customStoreUrl}${encodedText}`;
                        } else {
                            console.error('Custom store URL not found in cookie');
                            return;
                        }
                    } else {
                        url = `${storeUrls[store]}${encodedText}`;
                    }
                    link.href = url;
                    link.target = '_blank';
                    link.textContent = originalText; // Keep the original text for display
                    ingredient.textContent = '';
                    ingredient.appendChild(link);
                } else {
                    console.warn(`Filtered out ingredient: "${originalText}"`);
                }
            });
        });
        console.log(`Successfully updated links for ${store}`);
    } catch (error) {
        console.error('Error updating links:', error);
    }
}

// Create and insert the store selector
createStoreSelector();

// Load custom store details from cookie
loadCustomStoreDetails();

// Event listener for store selector change
const storeSelector = document.getElementById('store-selector');
if (storeSelector) {
    storeSelector.addEventListener('change', (e) => {
        updateLinks(e.target.value);
        setCookie('selectedStore', e.target.value, 30); // Save selected store to cookie
    });
} else {
    console.error("Could not find 'store-selector' element");
}

// Load selected store from cookie and update links
const selectedStore = getCookie('selectedStore');
if (selectedStore) {
    storeSelector.value = selectedStore;
    updateLinks(selectedStore);
} else {
    updateLinks('walmart'); // Default to Walmart if no cookie found
}

// Initial link update
updateLinks(storeSelector.value);