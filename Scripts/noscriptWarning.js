// This script will run if JavaScript is enabled
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online
document.addEventListener('DOMContentLoaded', function () {
    var warningBanner = document.getElementById('warning-banner');
    var noscriptWarning = warningBanner.querySelector('noscript');
    if (noscriptWarning) {
        warningBanner.removeChild(noscriptWarning);
    }
});