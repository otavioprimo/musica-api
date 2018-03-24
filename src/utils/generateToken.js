var async = require('asyncawait/async');

generate = async () => {
    var basic = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var token_gerado = "";
    for (var i = 0; i < 55; i++) {
        token_gerado += basic.charAt(Math.floor(Math.random() * basic.length));
    }

    return token_gerado;
}

module.exports = generate;