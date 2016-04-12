var fs = require('fs');

var pathToFile = process.argv[2];

//el metodo readFile retorna un buffer object

var buffer = fs.readFileSync(pathToFile);
var content = buffer.toString();
var lines = content.split('\n');
console.log(lines.length-1);


