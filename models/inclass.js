'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Class, {
        through: models.InClass,
        foreignKey: 'userId',
        otherKey: 'classId',
      });

      models.Class.belongsToMany(models.User, {
        through: models.InClass,
        foreignKey: 'classId',
        otherKey: 'userId',
      });

      models.InClass.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      models.InClass.belongsTo(models.Class, {
        foreignKey: 'classId',
        as: 'class',
      });
    }
  }
  InClass.init({
    userId:  {
      type :DataTypes.INTEGER,
      references:{
        model: 'User',
        key : 'id'
      }
    },
    classId:  {
      type :DataTypes.INTEGER,
      references:{
        model: 'Class',
        key : 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'InClass',
  });
  return InClass;
};