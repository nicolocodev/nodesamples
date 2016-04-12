var http = require('http');

var url = process.argv[2];

http.get(url, function(resp){

	resp.setEncoding('utf-8');

	resp.on('data', console.log);
		

});

