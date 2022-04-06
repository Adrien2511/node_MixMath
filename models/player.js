'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Player.belongsTo(models.User,{
        foreignKey:{
          allowNull : false
        }
      })
      models.Player.belongsTo(models.Duel,{
        foreignKey:{
          allowNull : false
        }
      })
    }
  }
  Player.init({

    score: DataTypes.INTEGER,
    Q1: DataTypes.STRING,
    Q2: DataTypes.STRING,
    Q3: DataTypes.STRING,
    Q4: DataTypes.STRING,
    Q5: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};