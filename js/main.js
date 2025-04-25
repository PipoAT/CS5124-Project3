import renderCharacterBarChart from './visualizations/barChart.js';
import renderCharacterLineChart from './visualizations/lineChart.js';
import renderCharacterWordCloud from './visualizations/wordCloud.js';
import renderShowPieChart from './visualizations/pieChart.js';
import renderShowArcDiagram from './visualizations/arcDiagram.js';
import fileNamesArray from './data_structures/fileNamesArray.js';
import charactersSet from './data_structures/charactersSet.js';
import seasonsArray from './data_structures/seasonsArray.js';

const processedData = [];
const characterCountMap = new Map();

function loadData() {
    const selectedSeason = document.getElementById('season').value;
    const seasonFiles = fileNamesArray.filter(fileName => fileName.startsWith(`data/${selectedSeason}x`));

    Promise.all(seasonFiles.map(fileName =>
        fetch(fileName)
            .then(response => response.text())
            .then(data => processFileData(data))
            .catch(error => console.error(`Error reading file ${fileName}:`, error))
    )).then(() => {
        const filteredCharacterCountMap = new Map(
            Array.from(characterCountMap.entries()).filter(([character]) => charactersSet.has(character))
        );
        updateVisualizations(filteredCharacterCountMap);
    });
}

function processFileData(data) {
    data.split('\n').forEach(line => {
        const [character, ...rest] = line.split(':');
        if (character) {
            const trimmedCharacter = character.trim();
            characterCountMap.set(
                trimmedCharacter,
                (characterCountMap.get(trimmedCharacter) || 0) + 1
            );
            processedData.push({ character: trimmedCharacter, line: rest.join(':') });
        }
    });
}

function populateDropdown(dropdownId, items) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = items.map(item => `<option value="${item}">${item}</option>`).join('');
}

function updateVisualizations(characterCountMap) {
    const characterData = Array.from(characterCountMap.entries()).map(([label, value]) => ({ label, value }));

    renderShowPieChart(characterData.map(({ label, value }) => ({ label, value })), 'pieChart');
    renderShowArcDiagram('#arcDiagram', {
        nodes: characterData.map(({ label }) => ({ id: label, label })),
        links: characterData.map((_, index) => ({ source: index, target: (index + 1) % characterData.length }))
    });
    renderCharacterWordCloud(
        '#wordCloud',
        Array.from(new Set(processedData.flatMap(({ line }) => 
            line.split(/\s+/).map(word => word.toLowerCase())
                .filter(word => !['the', 'and', 'a', 'to', 'of', 'in', 'that', 'it', 'is', 'was', 'he', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'by', 'one', 'had', 'not', 'but', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'about', 'out', 'them', 'then', 'so', 'her', 'would', 'him', 'into', 'has', 'more', 'two', 'like', 'see', 'no', 'could', 'my', 'than', 'been', 'who', 'its', 'now', 'did', 'get', 'come', 'made', 'may', 'part'].includes(word))
        ))).map(word => ({ text: word, size: word.length })),
        { width: 500, height: 500, fontSizeRange: [10, 50], fontFamily: "sans-serif", colors: d3.schemeCategory10 }
    );
    renderCharacterBarChart(characterData, '#barChart');
    renderCharacterLineChart(characterData, '#lineChart');
}

document.addEventListener('DOMContentLoaded', () => {
    populateDropdown('character', Array.from(charactersSet));
    populateDropdown('season', seasonsArray);
    loadData();
});

document.getElementById('season').addEventListener('change', loadData);
