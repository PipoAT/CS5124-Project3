// import { renderCharacterBarChart } from './visualizations/barChart.js';
// import { renderCharacterLineChart } from './visualizations/lineChart.js';
// import { renderCharacterWordCloud } from './visualizations/wordCloud.js';
// import { renderShowPieChart } from './visualiations/renderShowPieChart';
// import { renderShowArcDiagram } from './renderShowArcDiagram.js';
import { fileNamesArray } from './data_structures/fileNamesArray.js';
import  charactersArray  from './data_structures/charactersArray.js';
import  seasonsArray from './data_structures/seasonsArray.js';

function loadData() {
    // TODO: Load data from a TXT file and parse it into a usable format, e.g. JS sets or arrays
}

function populateCharacterDropdown() {
    const dropdown = document.getElementById('character'); // Ensure your HTML has a dropdown with this ID
    charactersArray.forEach(character => {
        const option = document.createElement('option');
        option.value = character;
        option.textContent = character;
        dropdown.appendChild(option);
    });
}

function populateSeasonDropdown() {
    const dropdown = document.getElementById('season'); // Ensure your HTML has a dropdown with this ID
    seasonsArray.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        dropdown.appendChild(option);
    });
}

function updateVisualizations() {
    // TODO: Update visualizations based on selected character
}

// Call the functions to populate the dropdowns when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateCharacterDropdown();
    populateSeasonDropdown();
});