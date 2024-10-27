// SearchHandler.js for Pankiverse/AI-Generated recipe book - Story time button (not 100% functional)
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online

function toggleContent() {
    const dynamicContent = document.getElementById('dynamic-content');
    const toggleButton = document.getElementById('toggle-button');

    if (dynamicContent.style.display === 'none' || dynamicContent.style.display === '') {
        dynamicContent.style.display = 'block';
        toggleButton.textContent = 'Hide monloug';
    } else {
        dynamicContent.style.display = 'none';
        toggleButton.textContent = 'Show monoloug';
    }
}