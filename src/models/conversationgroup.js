'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conversationGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  conversationGroup.init({
    sender: DataTypes.STRING,
    to: DataTypes.STRING,
    message: DataTypes.TEXT,
    roomCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'conversationGroup',
  });
  return conversationGroup;
};