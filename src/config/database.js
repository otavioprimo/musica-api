const Sequelize = require('sequelize');
const env = require('./enviroment');
const musica = require('../models/musicModel');

const sequelize = new Sequelize(env.DEV.database, env.DEV.username, env.DEV.password, {
    host: env.DEV.host,
    dialect: 'mysql',
    port: env.DEV.port,
    timezone: '-03:00',
    define: {
        underscored: true
    },
    operatorsAliases: false
});

//Monta todas as coisas na variavel db e retorna ela
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.musica = musica(sequelize, Sequelize);

//Conecta com o db
sequelize.authenticate()
    .then((data) => {
        console.log("Conectado com sucesso");
        //Cria dados iniciais no banco, usar somente quando tiver com db.sequelize.sync({force:true}) no arquivo server.js
        // setTimeout(() => {
        //     init_db.start(db);
        // }, 15000);
    })
    .catch((data) => {
        console.log("Erro ao conectar com o banco de dados - " + data);
    });

module.exports = db;