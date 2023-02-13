const express = require('express');
const validationResultMiddleware = require('../middleware/validationResult');
const { registerAuth, loginAuth } = require('../controllers/authController');
const {
  jwtValidateMiddleware,
} = require('../middleware/jwtValidateMiddleware');

const {
  bulkCreateMateri,
  updateMateri,
  multiDeleteMateri,
  getMateriSiswa,
  getMateriGuru,
} = require('../controllers/materiController');

const routers = express.Router();

// ========================== AUTH ========================= //
// === Users === //
routers.post('/register', registerAuth);
routers.post('/login', loginAuth);

routers.use(jwtValidateMiddleware);

// =========================== GET ========================= //
// === Materi === //
routers.get('/materi/list/siswa', getMateriSiswa);
routers.get('/materi/list/guru', getMateriGuru);

// =========================== POST ======================== //
// === materi === //
routers.post('/materi/multipleCreate', bulkCreateMateri);

// ========================= UPDATE ======================== //
// === materi === //
routers.put('/materi/update', updateMateri);

// ========================= DELETE ======================== //
// === materi === //
routers.delete('/materi/multiDelete', multiDeleteMateri);

module.exports = routers;
