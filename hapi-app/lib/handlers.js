var uuid = require('uuid'),
    fs = require('fs'),
    Joi = require('joi'), //Validaciones
    Boom = require('boom'),//Mensajes para errores en validaciones;
    CardStore = require('./cardStore'),
    UserStore = require('./userStore');

var Handlers = {};

//Uso de Joi
var nameSchema = Joi.string().min(3).max(50).required();
var emailSchema = Joi.string().email().required();
var passwordSchema = Joi.string().min(5).max(30).required();
var cardSchema = Joi.object().keys({
    name: nameSchema,
    recipient_email: emailSchema,
    sender_name: nameSchema,
    sender_email: emailSchema,
    card_image: Joi.string().regex(/.+\.(jpg|bmp|png|gif)\b/).required()
});

var loginSchema = Joi.object().keys({
    email: emailSchema,
    password: passwordSchema
});

var registerSchema = Joi.object().keys({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema
});

Handlers.getNewCardHandler = function (request, reply) {
    reply.view('new', { card_images: mapImages() });
}

Handlers.postNewCardHandler = function (request, reply) {
    Joi.validate(request.payload, cardSchema, function (err, val) {
        if (err) {
            return reply(Boom.badRequest(err.details[0].message));
        }
        var card = {
            name: val.name,
            recipient_email: val.recipient_email,
            sender_name: val.sender_name,
            sender_email: val.sender_email,
            card_image: val.card_image,
        };
        saveCard(card);
        reply.redirect('/cards');
    });
}

Handlers.loginHandler = function (request, reply) {
    Joi.validate(request.payload, loginSchema, (err, val) => {
        if (err)
            return reply(Boom.unauthorized('Credentials did not validate'))
        UserStore.validateUser(val.email, val.password, (err, user) => {
            if (err) return reply(err);
            request.auth.session.set(user);
            reply.redirect('/cards');
        });
    });
}

Handlers.logoutHandler = function (request, reply) {
    request.auth.session.clear();
    reply.redirect('/');
}

Handlers.registerHandler = function (request, reply) {
    Joi.validate(request.payload, registerSchema, (err, val) => {
        if (err)
            return reply(Boom.unauthorized('Register did not validate'))
        UserStore.createUser(val.name, val.email, val.password, (err) => {
            if (err) return reply("ERROORRR " + err);
            reply.redirect('/');
        });
    });
}

Handlers.getCardsHandler = function (request, reply) {
    reply.view('cards', { cards: getCards(request.auth.credentials.email) });
}

Handlers.deleteCardHandler = function (request, reply) {
    delete CardStore.cards[request.params.id];
    reply();
}

Handlers.uploadHandler = function(request, reply){
    var image = request.payload.upload_image;
    if(image.bytes){
        fs.link(image.path, 'public/images/cards/'+image.filename, ()=>{
            fs.unlink(image.path);            
        });
    }
    reply.redirect('/cards');
}

function saveCard(card) {
    var id = uuid.v1();
    card.id = id;
    CardStore.cards[id] = card
}

function mapImages() {
    return fs.readdirSync('./public/images/cards');
}

function getCards(email) {
    var cards = [];
    for (var key in CardStore.cards) {
        if (CardStore.cards[key].sender_email === email) {
            cards.push(CardStore.cards[key]);
        }
    }
    return cards;
}

module.exports = Handlers