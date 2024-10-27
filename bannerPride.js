// bannerPride.js for Pankiverse/AI-Generated recipe book - fancy warning label for AI generated content
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online

let hue = 0;
const gifUrl = 'trans-flag.gif';
let isShowingGif = false;
const gifInterval = 300000000; // 3000000 seconds between checks
const gifChance = 0.5; // 99% chance of showing the GIF

function changeColor() {
    if (!isShowingGif) {
        hue = (hue + 1) % 360;
        const newColor = `hsl(${hue}, 100%, 80%)`;
        const highlights = document.querySelectorAll('#warning-banner');
        highlights.forEach(function (element) {
            element.style.backgroundColor = newColor;
        });
    }
}

function toggleGif() {
    const randomValue = Math.random();
    console.log(`Checking GIF: random value is ${randomValue}, gifChance is ${gifChance}`);
    
    if (randomValue < gifChance && !isShowingGif) {
        console.log('Attempting to show GIF');
        isShowingGif = true;
        const highlights = document.querySelectorAll('#warning-banner');
        highlights.forEach(function (element) {
            element.style.backgroundImage = `url(${gifUrl})`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundPosition = 'center';
            element.style.backgroundColor = 'transparent';
        });
        console.log('GIF should now be visible');
    } else {
        console.log('Not showing GIF this time');
    }
}

function checkAndResetGif() {
    console.log('Checking GIF status');
    if (isShowingGif) {
        console.log('GIF is currently showing');
        if (Math.random() > gifChance) {
            console.log('Stopping GIF');
            isShowingGif = false;
            const highlights = document.querySelectorAll('#warning-banner');
            highlights.forEach(function (element) {
                element.style.backgroundImage = 'none';
                element.style.backgroundColor = `hsl(${hue}, 100%, 80%)`; // Reset background color
            });
            console.log('GIF stopped and background color reset');
        } else {
            console.log('GIF will continue to show');
        }
    } else {
        console.log('GIF is not showing, attempting to toggle');
        toggleGif();
    }
}


// Color changing interval (every 10ms)
setInterval(changeColor, 10);

// GIF check interval (every 30 seconds)
setInterval(checkAndResetGif, gifInterval);

// Initial check to potentially show GIF immediately
checkAndResetGif();
