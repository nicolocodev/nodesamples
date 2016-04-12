var http = require('http'),
    url = require('url'),
    port = parseInt(process.argv[2]);

function toTime(time) {    
    return {
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds()
        };
}

function toUnixTime(time) {
    return { unixtime : time.getTime() };
}

http.createServer(function (req, response) {
    
    if(req.method !== 'GET') res.end('Solo metodo get!');
    
    var reqUrl = url.parse(req.url, true);
    
    var result = null;
    var time = new Date(path.query.iso);
    
    if(path.pathname === '/api/parsetime') {
        result = toTime(time);        
    }
    else if(path.pathname === '/api/unixtime') {
        var result = toUnixTime(time);
    }
    
    if(result){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(result));
        response.end();
    }
    else{
        response.writeHead(404);
        response.write('Qué busca?');
        response.end();
    }
}).listen(port);