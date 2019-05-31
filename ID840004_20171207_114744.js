const lineReader = require('line-reader');
let count = 0;
const headers = [];
let groups = [];
let arrays = [];
let symbols = new Set();

lineReader.eachLine('ID840004_20171207_114744.wnd', function(line, last) {
    count++;
    
    if (count == 3) {
        line.replace(/\s/g,',').split(',').forEach(element => {
            if (element) {
                headers.push(element);
            }
        });
    }

    headers.forEach(header => {
        symbols.add(header.split('-')[0]);
    });

    if (count > 4) {
        var values = [];
        arrays = [];
        line.replace(/\s/g,';').split(';').forEach(element => {
            if (element) {
                values.push(element);
            }
        });
        for (let index = 0; index < values.length; index++) {
            const symbol = headers[index].split('-')[0];
            if (arrays[symbol] == null) {
                arrays[symbol] = [];
                var keyValue = {channel: symbol};
                arrays[symbol].push(keyValue)
            }
            var keyValue = {};
            keyValue[headers[index]] = values[index];
            keyValue['Date'] = values[0];
            keyValue['Time'] = values[1];
            arrays[symbol].push(keyValue);
        }

        symbols.forEach(symbol => {
            groups.push(arrays[symbol]);
        });
    }
    
    if ( last == true) {  // stop reading
        console.log(groups);
        return false; 
    }
});