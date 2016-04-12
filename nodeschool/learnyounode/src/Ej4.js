var fs = require("fs");

var pathToFile = process.argv[2];

fs.readFile(pathToFile, 'utf-8', function(err, data){

	var lines = data.split('\n');

	var count = lines.length - 1;

	console.log(count);
	
});
