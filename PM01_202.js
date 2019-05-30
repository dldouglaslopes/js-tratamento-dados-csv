const lineReader = require('line-reader');
let count = 0;
const headers = [];
let groups = [];
let arrays = [];
let symbols = new Set();

lineReader.eachLine('PM01_202.dat', function(line, last) {
    count++;
    
    if (count == 2) { //get headers in line 2
        line.split(',').forEach(element => { //get headers
            headers.push(element.replace(/['"]+/g, ''));
        });

        headers.forEach(header => { //get symbols
            const headerSplit = header.split('_').slice(0, -1).join("_");
            if (header.split('_').length == 1) {
                symbols.add(header);
            }
            else{
                symbols.add(headerSplit);
            }
        });
    }
    
    if (count > 4) { //get contents
        arrays = [];
        const values = line.split(',');
        for (let index = 0; index < values.length; index++) {
            const header = headers[index].split('_').slice(0, -1).join("_");
            if (arrays[header] == null) {
                arrays[header] = [];
            }
            var keyValue = {};
            keyValue[headers[index]] = values[index];
            keyValue['TIMESTAMP'] = values[0].replace(/['"]+/g, '');
            arrays[header].push(keyValue);
        }

        symbols.forEach(symbol => {
            if (groups[symbol] == null) {
                groups[symbol] = [];
            }
            groups[symbol].push(arrays[symbol]);
        });
    }
    
    if ( last == true) {  // stop reading
        console.log(groups['AN_60_2']);
        return false; 
    }
});