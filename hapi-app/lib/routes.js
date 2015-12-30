var Handlers = require('./handlers.js');

var routes = [
    {
        method: 'GET',
        path: '/',
        handler: {
            file: 'templates/index.html'
        },
        config: {
            auth: false
        }
    },
    {
        path: '/assets/{path*}',
        method: 'GET',
        handler: {
            directory: {
                path: './public',
                listing: false
            }
        },
        config: {
            auth: false
        }
    },
    {
        path: '/hello',
        method: 'GET',
        handler: function (req, reply) {
            reply.file('templates/index.html');
        }
    },
    {
        path: '/cards/new',
        method: 'GET',
        handler: Handlers.getNewCardHandler
    },
    {
        path: '/cards/new',
        method: 'POST',
        handler: Handlers.postNewCardHandler
    },
    {
        path: '/cards',
        method: 'GET',
        handler: Handlers.getCardsHandler
    },
    {
        path: '/cards/{id}',
        method: 'DELETE',
        handler: Handlers.deleteCardHandler
    },
    {
        path: '/login',
        method: 'GET',
        handler: {
            file: 'templates/login.html'
        },
        config: {
            auth: false
        }
    },
    {
        path: '/login',
        method: 'POST',
        handler: Handlers.loginHandler,
        config: {
            auth: false
        }
    },
    {
        path: '/logout',
        method: 'GET',
        handler: Handlers.logoutHandler
    },
    {
        path: '/register',
        method: 'GET',
        handler: {
            file: 'templates/register.html'
        },
        config: {
            auth: false
        }
    },
    {
        path: '/register',
        method: 'POST',
        handler: Handlers.registerHandler,
        config: {
            auth: false
        }
    },
    {
        path: '/upload',
        method: 'GET',
        handler: {
            file: 'templates/upload.html'
        }
    },
    {
        path: '/upload',
        method: 'POST',
        handler: Handlers.uploadHandler,
        config: {
            payload: {
                output: 'file',
                uploads: 'public/images'
            }
        }
    }
];

module.exports = routes;