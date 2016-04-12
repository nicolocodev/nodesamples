var http = require('http');

function get (url, callback) {
    
   http.get(url, function (response) {       
       response.setEncoding('utf-8');
       
       data = "";       
       response.on('data', function (d) {
           data += d;
       });
              
       response.on('end', function() {
           callback(null, data);
       });
   }); 
}

var urls  = process.argv.slice(2),
    count = 0;

function tryPrint(resps) {
    if(count++ === resps.length-1){
        resps.forEach(function (r) {
            console.log(r);
        });
    }
}

urls.forEach(function(url) {
    
    get(url, function (err, data) {
        var i = urls.indexOf(url);
        if(i===-1) throw "HP";
        
        urls[i] = data;
        
        tryPrint(urls);
    });
});