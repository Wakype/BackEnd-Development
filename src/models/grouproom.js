'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class groupRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      groupRoom.belongsTo(models.group, {
        as: 'grouproom',
        foreignKey: 'group'
      })
    }
  }
  groupRoom.init({
    username: DataTypes.STRING,
    group: DataTypes.STRING,
    chatRoom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'groupRoom',
  });
  return groupRoom;
};