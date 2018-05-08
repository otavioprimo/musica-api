const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Musica = sequelize.define('musica', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        image: { type: Sequelize.STRING, defaultValue: 'https://api.adorable.io/avatar/75/' },
        source: { type: Sequelize.STRING },
        artist: { type: Sequelize.STRING, allowNull: false },
        status: { type: Sequelize.BOOLEAN, defaultValue: true },
        name: { type: Sequelize.STRING, allowNull: false },
        deviceid: { type: Sequelize.STRING, allowNull: true }
    }, {
            getterMethods: {
                avatar() {
                    return this.getDataValue('image') + this.getDataValue('artist');
                }
            }
        },
        {
            underscored: true,

        });
    return Musica;
};
