var fs = require('fs'),
    path = require('path');



function ls(pathToDir, extFile, callback){

	fs.readdir(pathToDir, function(err, files){

		
		
		if(err) return callback (err);

		filtered = files.filter(function(file){
			return path.extname(file) === '.' + extFile;
		});
		callback(null, filtered);
	
	});
	
}

module.exports = ls;

