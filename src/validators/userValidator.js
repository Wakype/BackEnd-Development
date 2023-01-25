const { check } = require('express-validator');
const UserModel = require('../models').user;

const createUserValidator = [
  check('nama')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars long'),

  check('email')
    .isEmail()
    .withMessage('Gunakan format email')
    .custom((value) => {
      return UserModel.findOne({
        where: { email: value },
      }).then((user) => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
];

const updateUserValidator = [
  check('nama').isLength({ min: 3 }).withMessage('Nama minimal 3 huruf'),
];

module.exports = { createUserValidator, updateUserValidator };
