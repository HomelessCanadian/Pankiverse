// comparisonHandler.js for Paniverse/Fork of searchHandler.js - compare search terms for different grocers automatically
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online
// goddamn cors restrictions
// Function to create and insert the store selector
function createStoreSelector() {
    const storeSelectorContainer = document.getElementById('store-checkboxes');

    // Show/hide custom store fields based on the selected option
    const customCheckbox = document.getElementById('custom-checkbox');
    customCheckbox.addEventListener('change', (e) => {
        const customStoreFields = document.getElementById('custom-store-fields');
        if (e.target.checked) {
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
        customCheckbox.checked = false;
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
        console.log('Loaded custom store details from cookie');
    }
}

// Function to fetch ingredient list data
async function fetchIngredientList(searchTerm, stores) {
    const ingredientListsContainer = document.getElementById('ingredient-lists-container');
    ingredientListsContainer.innerHTML = ''; // Clear existing lists

    for (const store of stores) {
        const listContainer = document.createElement('div');
        listContainer.className = 'ingredient-list';
        listContainer.id = `ingredient-list-${store}`;

        let url;
        if (store === 'custom') {
            const customStoreUrl = getCookie('customStoreUrl');
            if (customStoreUrl) {
                url = `${customStoreUrl}${encodeURIComponent(searchTerm)}`;
            } else {
                console.error('Custom store URL not found in cookie');
                continue;
            }
        } else {
            url = `${storeUrls[store]}${encodeURIComponent(searchTerm)}`;
        }

        // Simulate fetching data (replace with actual implementation)
        // For demonstration, assume we fetch the HTML content and extract the ingredient list
        try {
            const response = await fetch(url);
            const htmlContent = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const ingredientList = doc.querySelectorAll('.search-result'); // Replace with actual selector

            // Display the ingredient list
            const listHeader = document.createElement('h2');
            listHeader.textContent = `${store} Results`;
            listContainer.appendChild(listHeader);

            ingredientList.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.textContent.trim();
                listContainer.appendChild(li);
            });

            ingredientListsContainer.appendChild(listContainer);
        } catch (error) {
            console.error(`Error fetching data for ${store}:`, error);
            const errorList = document.createElement('div');
            errorList.className = 'ingredient-list';
            errorList.id = `ingredient-list-${store}`;
            errorList.innerHTML = `<h2>${store} Results</h2><p>Error fetching data.</p>`;
            ingredientListsContainer.appendChild(errorList);
        }
    }
}

// Event listener for search button click
document.getElementById('search-button').addEventListener('click', async () => {
    const searchTerm = document.getElementById('search-term').value.trim();
    if (!searchTerm) {
        alert('Please enter a search term.');
        return;
    }

    const storeCheckboxes = document.querySelectorAll('#store-checkboxes input[type="checkbox"]:checked');
    const selectedStores = Array.from(storeCheckboxes).map(checkbox => checkbox.value);

    await fetchIngredientList(searchTerm, selectedStores);
});

// Create and insert the store selector
createStoreSelector();

// Load custom store details from cookie
loadCustomStoreDetails();
