// import { renderCharacterBarChart } from './visualizations/barChart.js';
// import { renderCharacterLineChart } from './visualizations/lineChart.js';
// import { renderCharacterWordCloud } from './visualizations/wordCloud.js';
// import { renderShowPieChart } from './visualiations/renderShowPieChart';
// import { renderShowArcDiagram } from './visualiations/renderShowArcDiagram.js';
import fileNamesArray from './data_structures/fileNamesArray.js';
import  charactersArray  from './data_structures/charactersArray.js';
import  seasonsArray from './data_structures/seasonsArray.js';

function loadData() {
    const seasonDropdown = document.getElementById('season');
    const selectedSeason = seasonDropdown.value;

    // Filter file names based on the selected season
    const seasonFiles = fileNamesArray.filter(fileName => fileName.startsWith(`data/${selectedSeason}x`));

    console.log(`Files for Season ${selectedSeason}:`, seasonFiles);

    // Read the files and process their content
    seasonFiles.forEach(fileName => {
        fetch(fileName)
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                lines.forEach(line => {
                    const [character, ...rest] = line.split(':');
                    if (character) {
                        console.log(`Character: ${character.trim()}`);
                    }
                });
            })
            .catch(error => console.error(`Error reading file ${fileName}:`, error));
    });

    // TODO: Use the processed data to update visualizations
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
    
}

// Call the functions to populate the dropdowns when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateCharacterDropdown();
    populateSeasonDropdown();
    loadData(); // Load data for the default selected season
    updateVisualizations(); // Initial call to populate visualizations based on the default selected season
});

document.getElementById('season').addEventListener('change', () => {
    loadData(); // Load data for the newly selected season
    updateVisualizations(); // Update visualizations based on the new selection
});
document.getElementById('character').addEventListener('change', () => {
    updateVisualizations(); // Update visualizations based on the newly selected character
});