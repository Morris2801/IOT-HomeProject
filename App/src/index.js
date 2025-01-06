// Import modules
import thingSpeakData from './js/data.js';
import ChartManager from './js/charts.js';
import { initializeApp } from './js/main.js';

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initializeApp(thingSpeakData, ChartManager);
});