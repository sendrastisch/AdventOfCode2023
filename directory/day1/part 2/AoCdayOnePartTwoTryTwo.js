const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('inputAoC.txt');
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

function processLine(line) {
    return new Promise((resolve) => {
        const wordToNumber = {
            one: '1',
            two: '2',
            three: '3',
            four: '4',
            five: '5',
            six: '6',
            seven: '7',
            eight: '8',
            nine: '9',
            ten: '10'
        };

        const words = {};
        const numbers = [];

        let highIndexWritten = 0;
        let highestWord = "";
        let highestIndexNumbers = 0;
        let highestOutOfBoth;

        let lowestIndexWritten = -1;
        let lowestWord = "";
        let lowestIndexNumbers = -1;
        let lowestOutOfBoth;

        //checks alle nummers uit de line en haalt het uit de string en stopt het in de numbers array. zet ook de number indices.
        function processNumbers(line){
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (!isNaN(char)) {
                    const index = numbers.findIndex(item => item[0] === char);
                    if (index === -1) {
                        numbers.push([char, i]);
                    } else {
                        numbers[index].push(i);
                    }

                    if (lowestIndexNumbers === -1) {
                        // Set the first occurrence index only if it hasn't been set before
                        lowestIndexNumbers = i;
                    }

                    if(i>highestIndexNumbers){
                        highestIndexNumbers = i
                    } else if(i<lowestIndexNumbers){
                        lowestIndexNumbers = i
                    }
                }
            }
        }

        //zoekt alle words uit de lines en maakt er een WORDS object van
        function processWords(line, wordToNumber){
            Object.keys(wordToNumber).forEach(word => {
                const lowerWord = word.toLowerCase();
                let index = line.indexOf(lowerWord);

                if(!line.includes(lowerWord)){
                    return;
                }

                if (lowestIndexWritten === -1) {
                    // Set the first occurrence index only if it hasn't been set before
                    lowestIndexWritten = index;
                    lowestWord = lowerWord;
                }

                while (index !== -1) {
                    if (!words[word]) {
                        words[word] = [];
                    }

                    words[word].push(index);

                    index = line.indexOf(lowerWord, index + 1);
                }
            });
        }

        //loopt door de words object en zoekt de hoogste en laagste woord
        function checkHighAndLowWords(words){
            Object.keys(words).forEach(word => {
                let innerArray = words[word];

                for (let i = 0; i < innerArray.length; i++) {
                    if(innerArray[i] > highIndexWritten){
                        highIndexWritten = innerArray[i];
                        highestWord = word;
                    } else if(innerArray[i] < lowestIndexWritten){
                        lowestIndexWritten = innerArray[i];
                        lowestWord = word;
                    }
                }
            });
        }


        //checkt de hoogste number en hoogste geschreven number en bepaald welke hoogste is
        function findHighestOutOfBoth(line){
            if(highestWord===""){
                highestOutOfBoth = line.charAt(highestIndexNumbers);
            } else{
                if(highestIndexNumbers > highIndexWritten){
                    highestOutOfBoth = line.charAt(highestIndexNumbers)
                } else {
                    highestOutOfBoth = highestWord;
                    const lowercasedWord = highestOutOfBoth.toLowerCase();

                    // Check if the word exists in the wordToNumber object
                    if (lowercasedWord in wordToNumber) {
                        // Return the corresponding number
                        highestOutOfBoth = wordToNumber[lowercasedWord]
                    }
                }
            }
        }

        //zelfde als findhighest maar dan met de lowest
        function findLowestOutOfBoth(line){
            if(lowestWord === ""){
                lowestOutOfBoth = line.charAt(lowestIndexNumbers);

            } else{
                if(lowestIndexNumbers < lowestIndexWritten){
                    lowestOutOfBoth = line.charAt(lowestIndexNumbers);
                } else{
                    lowestOutOfBoth = lowestWord;
                    const lowercasedWord = lowestOutOfBoth.toLowerCase();
                    if (lowercasedWord in wordToNumber) {
                        // Return the corresponding number
                        lowestOutOfBoth = wordToNumber[lowercasedWord]
                    }
                }
            }
        }

        processWords(line, wordToNumber);
        processNumbers(line);
        checkHighAndLowWords(words);
        findHighestOutOfBoth(line);
        findLowestOutOfBoth(line);

        let combinedResult = `${lowestOutOfBoth}${highestOutOfBoth}`;
        resolve(combinedResult);
})
}

// Array to store promises for each line
const linePromises = [];

// // // Process each line
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
