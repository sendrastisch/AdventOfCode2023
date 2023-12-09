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
        //DIT ZIJN DE MAXIMUM AANTAL BLOKIES
        const red = 12;
        const green = 13;
        const blue = 14;

        // Split de tekst voor het eerste voorkomen van ":"
        const parts = line.split(':');

        // Deel 1 bevat de tekst voor de dubbele punt
        const gameName = parts[0].trim();
        const gameNumber = gameName.split(" ")[1];
        // Deel 2 bevat de tekst na de dubbele punt
        const gameData = parts[1].trim();

        // Dit is de array met alle mini games in een game lol
        const gameDataSplit = gameData.split(';');

        for (let i = 0; i < gameDataSplit.length ; i++){
            //split de line nu nog verder zodat je aantal en kleur hebt
            let lineSplit = gameDataSplit[i].split(',');

            for (let j = 0; j < lineSplit.length; j++){// Deel 1 bevat het aantal
                const trimLine = lineSplit[j].trim();
                const trimSpace = trimLine.split(" ");
                const aantal = trimSpace[0];
                const kleur = trimSpace[1];

                if (kleur === "red" && aantal > red ||
                    kleur === "green" && aantal > green ||
                    kleur === "blue" && aantal > blue) {
                    return "nee";
                }
            }
        }
        resolve(gameNumber);
    });
}

const possibleGamesId = [];

//dit maar gedaan omdat ik niet goed ben in promises en de laatste line van de tekst for some reason pas doorlopen werd op t moment dat de promise al klaar was met wachten en alles
//al in de lijst had toegevoegd en al de sum had berekend
let allLinesProcessed = false;

readStream.on('line', async (line) => {
    console.log('Processing line:', line);
    const result = await processLine(line);

    if (result === null || result === undefined) {
        console.log("Invalid result for line:", line);
    } else {
        console.log('Valid result:', result);
        possibleGamesId.push(result);
    }
});

readStream.on('close', async () => {
    // Wacht tot alle regels zijn verwerkt
    if (!allLinesProcessed) {
        // Wacht even om eventuele vertraagde verwerking te voltooien
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
        // Filter out null or undefined values
        const filteredResultsArray = possibleGamesId.filter(value => value !== null && value !== undefined);

        const combinedResultsArray = await Promise.all(filteredResultsArray);
        console.log(combinedResultsArray)

        // Calculate the sum of the combined results
        const sum = combinedResultsArray.reduce((acc, value) => acc + Number(value), 0);
        console.log('Sum of combined results:', sum);
    } catch (error) {
        console.error('Error processing lines:', error);
    }
});

readStream.on('error', (err) => {
    console.error('Error:', err);
});

// Markeer dat alle regels zijn verwerkt wanneer de 'close'-callback wordt bereikt
readStream.on('close', () => {
    allLinesProcessed = true;
});
