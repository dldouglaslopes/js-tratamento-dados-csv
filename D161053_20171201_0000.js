const csv = require('csv-parser');
const fs = require('fs');
const results = [];
let columns = [];
let groups = [];
let arrays = [];
let symbols = new Set();

fs.createReadStream('D161053_20171201_0000.csv')
    .pipe(csv())
    .on('headers', (headers) => { //get headers
        columns = headers;
        headers.forEach(header => {
            const symbol = header.split(';')[0];
            symbols.add(symbol);
        });
    })
    .on('data', (data) => { //get data
        results.push(data);
    })
    .on('end', () => {
        results.forEach(result => { //get values of each row
            arrays = [];
            columns.forEach(column => {
                const symbol = column.split(';')[0];                
                if ((result[column] + '') !== 'undefined') {
                    if (arrays[symbol] == null) {
                        arrays[symbol] = [];
                        var keyValue = {channel: symbol};
                        arrays[symbol].push(keyValue)
                    }
                    var keyValue = {};
                    keyValue[column] = result[column];
                    keyValue['Date/time'] = result['Date/time'];
                    arrays[symbol].push(keyValue);
                }
            });
            
            symbols.forEach(symbol => { //get values of each symbol
                groups.push(arrays[symbol]);
            });
        });
        console.log(groups);
    });    