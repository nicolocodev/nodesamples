var fs = require('fs');

var CardStore = {};
CardStore.cards = {};

CardStore.init = function(){
    CardStore.cards = loadCards();
}

function loadCards() {
    var file = fs.readFileSync('./cards.json');
    return JSON.parse(file.toString());
}

module.exports = CardStore;