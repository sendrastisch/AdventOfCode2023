const fs = require('fs');
const path = require('path');

// Bouw het volledige pad naar input.txt
const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {

    if (err) {
        console.error(err);
        return;
    }

    const lines = data.split('\n');
    let totalPoints = 0;

    for (let lineIndex = 0; lineIndex < lines.length-1; lineIndex++) {
        const parts = lines[lineIndex].split('|');
        // Eerste deel zijn de winnende nummers, tweede deel zijn mijn nummers
        const firstPart = parts[0].split(':')[1].trim().split(/\s+/);
        const secondPart = parts[1].trim().split(/\s+/);
        let totalWin = 0;

        for (let i = 0; i < secondPart.length; i++) {
            if (firstPart.includes(secondPart[i])) {
                if (totalWin === 0) {
                    totalWin += 1;
                } else {
                    totalWin *= 2;
                }
            }
        }
        totalPoints+=totalWin;
    }

    console.log(totalPoints)

});
