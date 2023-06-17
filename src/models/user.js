'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.chatRoom, {
        as: 'chatUsername1',
        foreignKey: 'username1'
      }),
      user.hasMany(models.chatRoom, {
        as: 'chatUsername2',
        foreignKey: 'username2'
      }),
      user.hasMany(models.conversation, {
        as: 'conversationSender',
        foreignKey: 'sender'
      }),
      user.hasMany(models.conversation, {
        as: 'conversationTo',
        foreignKey: 'to'
      })
    }
  }
  user.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};