var fs = require('fs'),
    path = require('path');


var pathToDir = process.argv[2];

var fileExt = process.argv[3];

function isFileExt(file){
	
	return path.extname(file) === '.'+fileExt;
}

fs.readdir(pathToDir, function(err, list){

	list.filter(isFileExt).forEach(function(file){
		console.log(file);
	
	});

});
