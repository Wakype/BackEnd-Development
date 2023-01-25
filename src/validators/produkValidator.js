const { check } = require('express-validator');
const ProdukModel = require('../models').produk;

const createProdukValidator = [
  check('namaProduk')
    .isLength({ min: 5 })
    .withMessage('Nama produk minimal 5 huruf')
    .custom((value) => {
      return ProdukModel.findOne({
        where: { namaProduk: value },
      }).then((produk) => {
        if (produk) {
          return Promise.reject('Nama Produk sudah digunakan');
        }
      });
    }),

    check('deskripsiProduk').isLength({min: 20}).withMessage('Deskripsi produk minimal 20 huruf'),

    check('hargaProduk').isLength({min: 4}).withMessage('harga produk minimal 1000')
];

module.exports = { createProdukValidator };
