const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('inputAoC.txt', 'utf8');
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});


// Function to process each line
function processLine(line) {
    return new Promise((resolve) => {
        let numbers = [];

        for (const char of line) {
            if (!isNaN(char)) {
                numbers.push(char);
            }
        }

        let one = numbers[0];
        let last = numbers[numbers.length - 1];
        let combinedResult = `${one}${last}`;


        resolve(combinedResult);
    });
}

// Array to store promises for each line
const linePromises = [];

// Process each line
rl.on('line', (line) => {
    // Store the promise for each line in the array
    linePromises.push(processLine(line));
});


// Handle end of file
rl.on('close', () => {
    // Wait for all promises to resolve
    Promise.all(linePromises)
        .then((combinedResultsArray) => {
            // Log combined results for all lines
            console.log('Combined results for all lines:', combinedResultsArray);

            // Calculate the sum of the combined results
            const sum = combinedResultsArray.reduce((acc, value) => acc + Number(value), 0);
            console.log('Sum of combined results:', sum);
        })
        .catch((error) => {
            console.error('Error processing lines:', error);
        });
});

// Handle errors
rl.on('error', (error) => {
    console.error('Error reading the file:', error);
});
