'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Message.belongsTo(models.User,{
        foreignKey:{
          allowNull : false
        }
      })
    }
  }
  Reply.init({
    userId: DataTypes.INTEGER,
    idAdversaire: DataTypes.INTEGER,
    idDuel: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
  });
  return Reply;
};