'use strict';

var Hapi = require('hapi'),
    CardStore = require('./lib/cardStore'),
    routes = require('./lib/routes'),
    UserStore = require('./lib/userStore');

var server = new Hapi.Server();

//memory DB
CardStore.init();
UserStore.init();

//Open Conn
server.connection({ port: 3000 });

// TODO: Buscar: El ciclo de vida de un request en Hapi
// Y la funcion ext
// server.ext('onRequest', function (req, res) {
//     console.log('Request received: ' + req.path);
//     res.continue();
// });
server.ext('onPreResponse', function (request, reply) {
    if (request.response.isBoom) {
        return reply.view('error', request.response);
    }
    reply.continue();
});

//Así se registran los plugins
var plugins = [require('inert'), require('vision')];
server.register(plugins, (err) => {
    if (err) throw err;
});

//Esta es otra forma de registrar los plugins:
//pasando un objeto con opciones al register
//el objeto opciones configura el plugin. 
server.register({
    //El plugin Good: Para logs y monitoreo
    register: require('good'),
    options: {
        opsInterval: 5000,
        reporters: [
            {
                reporter: require('good-file'),
                events: { ops: '*' },
                config: {
                    path: './logs',
                    prefix: 'hapi-proc',
                    rotate: 'daily'
                }
            },
            {
                reporter: require('good-file'),
                events: { response: '*' },
                config: {
                    path: './logs',
                    prefix: 'hapi-requests',
                    rotate: 'daily'
                }
            },
            {
                reporter: require('good-file'),
                events: { error: '*' },
                config: {
                    path: './logs',
                    prefix: 'hapi-error',
                    rotate: 'daily'
                }
            }
        ]
    }
}, (err) => {
    if (err) console.log("Error configurando Good " + err);
});

server.register(require('hapi-auth-cookie'), (err)=>{
    if(err) console.log("Error registrando auth-cookie " + err);
    server.auth.strategy('default','cookie',{
        password: 'myPass',
        redirectTo: '/login',
        isSecure: false        
    });
    server.auth.default('default');
});

//Usar ViewEngines
server.views({
    engines: {
        html: require('handlebars')
    },
    path: './templates'
});

//"Route" permite un array de rutas.
server.route(routes);

server.start((err) => {
    if (err) console.log('Error! ' + err);
    console.log('Listening on ' + server.info.uri);
});