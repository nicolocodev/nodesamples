var bcrypt = require('bcryptjs'),
    Boom = require('boom');

var UserStore = {};

UserStore.users = {};

UserStore.init = function () {
    UserStore.createUser('Nicolas', 'n@herrera.com', 'password');
};

UserStore.createUser = function (name, email, password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            var user = {
                name: name,
                email: email,
                passwordHash: hash
            };
            if (UserStore.users[email]) {
                callback(Boom.conflict('email already exists, please login'));
            }
            else {
                UserStore.users[email] = user;
                if (callback) callback();
            }
        });
    });
};

UserStore.validateUser = function(email, password, callback){
    var user = UserStore.users[email];
    if(!user){
        callback(Boom.notFound('User does not exist'));
        return;
    }
    bcrypt.compare(password, user.passwordHash,  function (err, isValid){
       if(!isValid) callback(Boom.unauthorized('Password does not match.'));
       else callback(null, user); 
    });
}

module.exports = UserStore;