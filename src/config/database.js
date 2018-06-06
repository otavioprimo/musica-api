const Sequelize = require("sequelize");
const env = require("./enviroment");
const musica = require("../models/musicModel");

const sequelize = new Sequelize(env.PROD.database, env.PROD.username, env.PROD.password, {
    host: env.PROD.host,
    dialect: "mysql",
    port: env.PROD.port,
    timezone: "-03:00",
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
    })
    .catch((data) => {
        console.log("Erro ao conectar com o banco de dados - " + data);
    });

module.exports = db;