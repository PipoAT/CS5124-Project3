import { renderCharacterBarChart } from './visualizations/barChart.js';
import { renderCharacterLineChart } from './visualizations/lineChart.js';
import { renderCharacterWordCloud } from './visualizations/wordCloud.js';
import { renderShowPieChart } from './visuzliations/renderShowPieChart';
import { renderShowArcDiagram } from './renderShowArcDiagram.js';
import { fileNamesArray } from './data_structures/fileNamesArray.js';
import { charactersArray } from './data_structures/charactersArray.js';
import { seasonsArray } from './data_structures/seasonsArray.js';

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

function updateVisualizations() {
    // TODO: Update visualizations based on selected character
}

// Call the function to populate the dropdown when the page loads
document.addEventListener('DOMContentLoaded', populateCharacterDropdown);