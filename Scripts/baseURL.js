// baseURL.js for Pankiverse/HTML scripting servoce script to relocate relevant routers
// Priority: load before all scripts requiring relative elements
// Copyright (c) 2024 GPT-4
const baseURL = window.location.origin + '/Pankiverse/';
document.documentElement.setAttribute('base', baseURL);
