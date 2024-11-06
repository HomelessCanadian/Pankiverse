// bannerPride.js for Pankiverse/AI-Generated recipe book - fancy warning label for AI generated content
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online

let hue = 0;
let isShowingIframe = false;
const iframeInterval = 600000; // 10 minutes in milliseconds
const iframeChance = 0.5; // 50% chance of showing the iframe

function changeColor() {
    if (!isShowingIframe) {
        hue = (hue + 1) % 360;
        const newColor = `hsl(${hue}, 100%, 80%)`;
        const highlights = document.querySelectorAll('#warning-banner');
        highlights.forEach(function (element) {
            element.style.backgroundColor = newColor;
        });
    }
}

function toggleIframe() {
    const randomValue = Math.random();
    console.log(`Checking Iframe: random value is ${randomValue}, iframeChance is ${iframeChance}`);
    
    if (randomValue < iframeChance && !isShowingIframe) {
        console.log('Attempting to show Iframe');
        isShowingIframe = true;
        const iframeContainer = document.getElementById('banner-iframe-container');
        iframeContainer.style.display = 'block';
        const highlights = document.querySelectorAll('#warning-banner');
        highlights.forEach(function (element) {
            element.style.backgroundColor = 'transparent'; // Reset background color
        });
        console.log('Iframe should now be visible');
    } else {
        console.log('Not showing Iframe this time');
    }
}

function checkAndResetIframe() {
    console.log('Checking Iframe status');
    if (isShowingIframe) {
        console.log('Iframe is currently showing');
        if (Math.random() > iframeChance) {
            console.log('Stopping Iframe');
            isShowingIframe = false;
            const iframeContainer = document.getElementById('banner-iframe-container');
            iframeContainer.style.display = 'none';
            const highlights = document.querySelectorAll('#warning-banner');
            highlights.forEach(function (element) {
                element.style.backgroundColor = `hsl(${hue}, 100%, 80%)`; // Reset background color
            });
            setTimeout(() => {
                isShowingIframe = null; // Set to null to indicate it can be toggled again
            }, iframeInterval); // 10 minutes cooldown
        }
    } else if (isShowingIframe === null) {
        console.log('Iframe is in cooldown, not toggling');
    } else {
        console.log('Iframe is not showing, attempting to toggle');
        toggleIframe();
    }
}

// Color changing interval (every 10ms)
setInterval(changeColor, 10);

// Iframe check interval (every 10 minutes)
setInterval(checkAndResetIframe, iframeInterval);

// Initial check to potentially show Iframe immediately
checkAndResetIframe();
