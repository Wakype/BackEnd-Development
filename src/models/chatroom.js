'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chatRoom.belongsTo(models.user, {
        as: 'chatUsername1',
        foreignKey: 'username1'
      }),
      chatRoom.belongsTo(models.user, {
        as: 'chatUsername2',
        foreignKey: 'username2'
      })
    }
  }
  chatRoom.init({
    username1: DataTypes.STRING,
    username2: DataTypes.STRING,
    chatRoom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chatRoom',
  });
  return chatRoom;
};