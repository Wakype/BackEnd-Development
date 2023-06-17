'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversationGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'users',
          key: 'username',
          as: 'sender',
        },
      },
      to: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'groups',
          key: 'id',
          as: 'to',
        },
      },
      message: {
        type: Sequelize.TEXT
      },
      roomCode: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'groups',
          key: 'chatRoom',
          as: 'roomCode',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversationGroups');
  }
};