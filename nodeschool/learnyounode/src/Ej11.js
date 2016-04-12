var http = require('http'),
    fs = require('fs');
    port = parseInt(process.argv[2]),
    pathToFile = process.argv[3];
    
var server = http.createServer(function (req, res) {
    var readable = fs.createReadStream(pathToFile);
    readable.pipe(res);   
});

server.listen(port);