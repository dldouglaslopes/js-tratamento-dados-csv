const lineReader = require('line-reader');
let count = 0;
const headers = [];
let groups = [];
let arrays = [];
let symbols = new Set();

lineReader.eachLine('74200101.N18', function(line, last) {
    count++;
    
    if (count == 171) {
        line.split(',').forEach(element => { //get headers
            headers.push(element.replace(/['"]+/g, ''));
        });
        headers.forEach(header => { //get symbols
            if (header == 'Date & Time Stamp') {
                symbols.add(header);
            }
            else if(header.length % 2 == 0) {
                symbols.add(header.substring(0, (header.length / 2)));
            }
            else{
                symbols.add(header.substring(0, (header.length / 2) + 1));
            }
        });
    }

    if (count > 171) {
        arrays = [];
        const values = line.split(',');
            
        symbols.forEach(symbol => {
            for (let index = 0; index < values.length; index++) {
                const header = headers[index];
                const size = symbol.length;
                const headerSubStr = header.substring(0, size);
                
                if (symbol == headerSubStr) {
                    if (arrays[headerSubStr] == null) {
                        arrays[headerSubStr] = [];
                    }
                    var keyValue = {};
                    keyValue[header] = values[index];
                    keyValue['Date & Time Stamp'] = values[0];
                    arrays[headerSubStr].push(keyValue);
                }
            }
        });
        
        symbols.forEach(symbol => {
            if (groups[symbol] == null) {
                groups[symbol] = [];
            }
            groups[symbol].push(arrays[symbol]);
        });
    }
    
    if ( last == true) {  // stop reading
        console.log(groups);
        return false; 
    }
});