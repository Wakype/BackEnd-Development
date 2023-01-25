const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  getListUser,
  createUser,
  getDetailUserById,
  getDetailUserByParams,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const {
  getListProduk,
  getDetailProdukById,
  getDetailProdukByKategori,
  createProduk,
} = require('../controllers/produkController');
const validationResultMiddleware = require('../middleware/validationResult');
const userValidator = require('../validators/userValidator');
const { createUserValidator } = require('../validators/userValidator');
const { createProdukValidator } = require('../validators/produkValidator');

const routers = express.Router();

// =========================== GET ========================= //
// === Users === //
routers.get('/user/list', getListUser);
routers.get('/user/detail/:id', getDetailUserById);
routers.get('/user/list/:email', getDetailUserByParams);

// === Products === //
routers.get('/produk', getListProduk);
routers.get('/produk/detail/:id', getDetailProdukById);
routers.get('/produk/kategori/:kategori', getDetailProdukByKategori);

// =========================== POST ======================== //
// === Users === //
routers.post(
  '/user/create',
  userValidator.createUserValidator,
  validationResultMiddleware,
  createUser
);

// === Products === //
routers.post('/produk/create', createProdukValidator, validationResultMiddleware, createProduk)

// ========================= UPDATE ======================== //
// === Users === //
routers.put('/user/update/:id', userValidator.updateUserValidator, validationResultMiddleware, updateUser)

// ========================= DELETE ======================== //
// === Users === //
routers.delete('/user/delete/:id', deleteUser)

module.exports = routers;