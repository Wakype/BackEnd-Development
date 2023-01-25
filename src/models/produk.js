'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  produk.init({
    namaProduk: DataTypes.STRING,
    deskripsiProduk: DataTypes.STRING,
    kategoriProduk: DataTypes.STRING,
    daerah: DataTypes.STRING,
    hargaProduk: DataTypes.INTEGER,
    stokProduk: DataTypes.INTEGER,
    ratingProduk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'produk',
  });
  return produk;
};