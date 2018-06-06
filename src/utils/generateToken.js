var async = require("asyncawait/async");

let generate = async () => {
    var basic = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var tokenGerado = "";
    for (var i = 0; i < 55; i++) {
        tokenGerado += basic.charAt(Math.floor(Math.random() * basic.length));
    }

    return tokenGerado;
}

module.exports = generate;