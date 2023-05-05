const express = require('express');
const path = require('path');
const fs = require('fs');
const validationResultMiddleware = require('../middleware/validationResult');
const {
  jwtValidateMiddleware,
} = require('../middleware/jwtValidateMiddleware');

const routers = express.Router();

module.exports = routers;
