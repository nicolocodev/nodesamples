/**
 * Created by nicolocodev on 24/05/2014.
 */

var http = require("http"),
    fs = require("fs"),
    path = require("path"),
    mime = require("mime"),
    cache = {}

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.write('<h1> Content not found</h1>')
    response.end()
}

function sendFile(response, reqPath, fileContents) {
    response.writeHead('200', {'Content-Type': mime.lookup(path.basename(reqPath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

var server = http.createServer(
    function (request, response) {
        var filePath = false;
        if (request.url == '/') {
            filePath = 'views/index.html';
        } else {
            filePath = request.url;
        }
        var absPath = './' + filePath;
        serveStatic(response, cache, absPath);
    }).listen(2500, function () {
        console.log("Listening on port 2500")
    });

var chatServer = require('./chat_server');
chatServer.listen(server);