const express = require('express');
const path = require('path');
const fs = require('fs');
const validationResultMiddleware = require('../middleware/validationResult');
const {
  jwtValidateMiddleware,
} = require('../middleware/jwtValidateMiddleware');
const { loginAuth, authMe } = require('../controllers/authController');

const routers = express.Router();

routers.post('/login', loginAuth);

routers.use(jwtValidateMiddleware);

routers.get('/authme', authMe);

module.exports = routers;
