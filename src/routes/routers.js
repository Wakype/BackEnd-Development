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
  updatePassowordUser,
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
const {
  registerAuth,
  loginAuth,
  lupaPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  jwtValidateMiddleware,
} = require('../middleware/jwtValidateMiddleware');
const {
  createArtikel,
  getArtikel,
  getArtikelByUser,
  updateArtikel,
  deleteArtikel,
} = require('../controllers/artikelController');

const routers = express.Router();

// ========================== AUTH ========================= //
// === Users === //
routers.post('/register', registerAuth);
routers.post('/login', loginAuth);
routers.post('/lupa-password', lupaPassword);
routers.post('/reset-password/:userId/:token', resetPassword);

routers.use(jwtValidateMiddleware);

// =========================== GET ========================= //
// === Users === //
routers.get('/user/list', getListUser);
routers.get('/user/detail/:id', getDetailUserById);
routers.get('/user/list/:email', getDetailUserByParams);

// === Products === //
routers.get('/produk', getListProduk);
routers.get('/produk/detail/:id', getDetailProdukById);
routers.get('/produk/kategori/:kategori', getDetailProdukByKategori);

// === Products === //
routers.get('/artikel/list', getArtikel);
routers.get('/artikel/list/:userID', getArtikelByUser);

// =========================== POST ======================== //
// === Users === //
routers.post(
  '/user/create',
  userValidator.createUserValidator,
  validationResultMiddleware,
  createUser
);

// === Products === //
routers.post(
  '/produk/create',
  createProdukValidator,
  validationResultMiddleware,
  createProduk
);

// === artikel === //
routers.post('/artikel/create', createArtikel);

// ========================= UPDATE ======================== //
// === Users === //
routers.put(
  '/user/update/:id',
  userValidator.updateUserValidator,
  validationResultMiddleware,
  updateUser
);
routers.put(
  '/user/updatePassword',
  userValidator.updatePasswordValidator,
  validationResultMiddleware,
  updatePassowordUser
);

// === artikel === //
routers.put('/artikel/update/:id', updateArtikel);

// ========================= DELETE ======================== //
// === Users === //
routers.delete('/user/delete/:id', deleteUser);

// === artikel === //
routers.delete('/artikel/delete/:id', deleteArtikel);

module.exports = routers;
