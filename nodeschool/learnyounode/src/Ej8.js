var http = require('http');

var url = process.argv[2];

http.get(url, function(response){
	response.setEncoding('utf-8');
	var data = '';
	response.on('data', function(d){
		data = data + d;

	});

	response.on('end', function(i){
		console.log(data.length);
		console.log(data);
	});

});
