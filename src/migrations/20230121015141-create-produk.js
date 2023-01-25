'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      namaProduk: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      deskripsiProduk: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kategoriProduk: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      daerah: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      hargaProduk: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      stokProduk: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      ratingProduk: {
        defaultValue: 0,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('produks');
  },
};
