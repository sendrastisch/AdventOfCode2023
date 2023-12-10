const fs = require('fs');
const readline = require('readline');

const readStream = readline.createInterface({
    input: fs.createReadStream('input.txt'),
    output: process.stdout,
    terminal: false
});
// Function to process each line
function processLine(line) {
    return new Promise((resolve) => {

        // Split de tekst voor het eerste voorkomen van ":"
        const parts = line.split(':');
        const gameData = parts[1].trim();

        // Dit is de array met alle mini games in een game lol
        const gameDataSplit = gameData.split(';');
        const highestValues = { red: 0, green: 0, blue: 0 };

        for (let i = 0; i < gameDataSplit.length; i++) {
            let lineSplit = gameDataSplit[i].split(',');

            for (let j = 0; j < lineSplit.length; j++) {
                const [aantalStr, kleur] = lineSplit[j].trim().split(" ");
                const aantal = parseInt(aantalStr, 10);

                highestValues[kleur] = Math.max(highestValues[kleur], aantal);
            }
        }

        resolve(highestValues.red * highestValues.blue * highestValues.green);
    });
}

const possibleGamesId = [];

//dit maar gedaan omdat ik niet goed ben in promises en de laatste line van de tekst for some reason pas doorlopen werd op t moment dat de promise al klaar was met wachten en alles
//al in de lijst had toegevoegd en al de sum had berekend
let allLinesProcessed = false;

readStream.on('line', async (line) => {
    // console.log('Processing line:', line);
    const result = await processLine(line);

    if (result === null || result === undefined) {
        // console.log("Invalid result for line:", line);
    } else {
        // console.log('Valid result:', result);
        possibleGamesId.push(result);
    }
});

readStream.on('close', async () => {
    // Wacht tot alle regels zijn verwerkt
    if (!allLinesProcessed) {
        // Wacht even om vertraagde verwerking te voltooien
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    try {
        const filteredResultsArray = possibleGamesId.filter(value => value !== null && value !== undefined);

        const combinedResultsArray = await Promise.all(filteredResultsArray);
        const sum = combinedResultsArray.reduce((acc, value) => acc + Number(value), 0);
    } catch (error) {
        console.error('Error processing lines:', error);
    }
});

readStream.on('error', (err) => {
    console.error('Error:', err);
});

readStream.on('close', () => {
    allLinesProcessed = true;
});
