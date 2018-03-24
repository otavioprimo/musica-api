const express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var validator = require('express-validator');
var db = require('./src/config/database');
var fileUpload = require('express-fileupload');
var path = require("path");
var createDir = require('./src/utils/createDir');
var port = process.env.PORT || 5000;

let musicRoute = require('./src/routes/musicaRoute');

createDir('./public/musicas');

//Habilitar o cors
app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(validator());
app.use(fileUpload());

app.use('/hello', function (req, res) {
    res.send("Hello World");
});
app.use('/static', express.static(__dirname + '/public'));
app.use('/api/v1/music', musicRoute);

db.sequelize.sync().then(() => {
    app.listen(port);
});
