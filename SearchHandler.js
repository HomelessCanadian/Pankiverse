// SearchHandler.js for Pankiverse/AI-Generated recipe book - Shopping hyperlink module
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online

// Function to create and insert the slider
function createSlider() {
    const sliderContainer = document.createElement('div');
    sliderContainer.innerHTML = `
        <label for="store-slider">Choose a store: </label>
        <select id="store-slider">
          <option value="walmart">Walmart</option>
          <option value="kroger">Kroger</option>
          <option value="meijer">Meijer</option>
          <option value="aldi">Aldi</option>
          <option value="publix">Publix</option>
          <option value="albertsons">Albertsons</option>
        </select>
      `;

    // Find the first instance of "Ingredients:" and insert the slider after it
    const ingredientsHeaders = document.querySelectorAll('h2');
    const ingredientsHeader = Array.from(ingredientsHeaders).find(el => el.textContent.trim() === 'Ingredients:');
    if (ingredientsHeader) {
        ingredientsHeader.parentNode.insertBefore(sliderContainer, ingredientsHeader.nextSibling);
        console.log("Slider inserted successfully");
    } else {
        console.error("Could not find 'Ingredients:' header");
    }
}

// Store URLs
const storeUrls = {
    walmart: 'https://www.walmart.com/search?q=',
    kroger: 'https://www.kroger.com/search?query=',
    meijer: 'https://www.meijer.com/shopping/search.html?text=',
    aldi: 'https://new.aldi.us/results?q=',
    publix: 'https://www.publix.com/search?searchTerm=',
    albertsons: 'https://www.albertsons.com/shop/search-results.html?q='
};

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
                    link.href = `${storeUrls[store]}${encodedText}`;
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

// Create and insert the slider
createSlider();

// Event listener for slider change
const storeSlider = document.getElementById('store-slider');
if (storeSlider) {
    storeSlider.addEventListener('change', (e) => {
        updateLinks(e.target.value);
    });
} else {
    console.error("Could not find 'store-slider' element");
}

// Initial link update
updateLinks('walmart');