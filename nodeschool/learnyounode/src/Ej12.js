var http = require('http');

var port = parseInt(process.argv[2]);

var server = http.createServer(function (req, res) {
    if(req.method === 'POST'){
        
        var body = "";
                 
        req.on('data', function (chunk) {
            body += chunk;
        });
        
        req.on('end', function () {
            res.write(body.toUpperCase());
            res.end();
        });
    }        
});

server.listen(port);