import renderCharacterBarChart from './visualizations/barChart.js';
// import { renderCharacterLineChart } from './visualizations/lineChart.js';
import renderCharacterWordCloud from './visualizations/wordCloud.js';
// import { renderShowPieChart } from './visualizations/renderShowPieChart.js';
// import { renderShowArcDiagram } from './visualiations/renderShowArcDiagram.js';
import fileNamesArray from './data_structures/fileNamesArray.js';
import charactersArray  from './data_structures/charactersArray.js';
import seasonsArray from './data_structures/seasonsArray.js';
// import { update } from 'tar';

function loadData() {
    const seasonDropdown = document.getElementById('season');
    const selectedSeason = seasonDropdown.value;

    // Filter file names based on the selected season
    const seasonFiles = fileNamesArray.filter(fileName => fileName.startsWith(`data/${selectedSeason}x`));

    console.log(`Files for Season ${selectedSeason}:`, seasonFiles);

    // Array to store the processed data
    const processedData = [];

    // Create a map to count character occurrences
    const characterCountMap = new Map();

    // Create an array of fetch promises
    const fetchPromises = seasonFiles.map(fileName =>
      fetch(fileName)
          .then(response => response.text())
          .then(data => {
              const lines = data.split('\n');
              lines.forEach(line => {
                  const [character, ...rest] = line.split(':');
                  if (character) {
                      const trimmedCharacter = character.trim();
                      characterCountMap.set(
                          trimmedCharacter,
                          (characterCountMap.get(trimmedCharacter) || 0) + 1
                      );
                  }
              });
          })
          .catch(error => console.error(`Error reading file ${fileName}:`, error))
    );

    // Wait for all files to be fetched and processed
    Promise.all(fetchPromises).then(() => {
      // This runs once, after all episodes are processed
      console.log('Character Count Map (Season):', Array.from(characterCountMap.entries()));
      updateVisualizations(characterCountMap); // Pass the map to the visualization function
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

function updateVisualizations(characterCountMap) {
  renderCharacterWordCloud('#wordCloud', Array.from(characterCountMap.entries()).map(([text, size]) => ({ text, size })), {
    width: 500,
    height: 500,
    fontSizeRange: [10, 50],
    fontFamily: "sans-serif",
    colors: d3.schemeCategory10,
});
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