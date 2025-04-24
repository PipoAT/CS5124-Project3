import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../data');
const charactersSet = new Set();

fs.readdirSync(dataDir).forEach(file => {
    if (file.endsWith('.txt')) {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        fileContent.split('\n').forEach(line => {
            const match = line.match(/^(\w+):/);
            if (match) {
                charactersSet.add(match[1]);
            }
        });
    }
});

const charactersArray = Array.from(charactersSet);

export { charactersArray };