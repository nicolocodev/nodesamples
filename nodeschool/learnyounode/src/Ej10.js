var net = require('net');

function padLeft(pad, str) {
    return pad.substring(0, pad.length - str.length) + str
}

function formatDate(date) {
    return '' + date.getFullYear() + 
        '-' + padLeft("00", '' + (date.getMonth()+1)) + 
        '-' + padLeft("00", '' + date.getDate()) + 
        ' ' + date.getHours() + 
        ':' + padLeft("00", '' + date.getMinutes());
}

var server = net.createServer(function (socket) {
    socket.end(formatDate(new Date()) + '\n'); 
});

var port = process.argv[2];

server.listen(port);