const UserModel = require('../models').user;
const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sequelize } = require('../models');

async function register({ username, password, role }) {
  const hashPassword = bcrypt.hashSync(password, 10);
  let db_transaction = await sequelize.transaction();

  try {
    if (namaPetugas === '' || namaPetugas === undefined) {
      const result = await UserModel.create({
        namaLengkap: namaLengkap,
        username: username,
        telp: telp,
        password: hashPassword,
      });

      return result;
    }

    const { id } = await LevelModel.create(
      {
        level: role,
      },
      { transaction: db_transaction }
    );

    const result = await PetugasModel.create(
      {
        namaPetugas: namaPetugas,
        username: username,
        password: hashPassword,
        id: id,
      },
      { transaction: db_transaction }
    );
    db_transaction.commit();
    return result;
  } catch (error) {
    db_transaction.rollback();
    throw error;
  }
}

async function login({ username, password, req, res }) {
  try {
    const user = await UserModel.findOne({
      where: {
        username: username,
      },
    });

    if (user === null) {
      return res.status(404).json({
        status: 'Fail',
        msg: 'Username tidak ditemukan silahkan register',
      });
    }
    if (password === null) {
      return res.status(404).json({
        status: 'Fail',
        msg: 'Email & Password tidak dicocok',
      });
    }
    if (user !== null) {
      if (user.password === password) {
        const token = jwt.sign(
          {
            id: user?.id,
            username: user?.username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d',
          }
        );

        res.json({
          status: 'Success',
          msg: 'successfully login',
          token: token,
          user: user,
        });
      } else {
        return res.status(404).json({
          status: 'Fail',
          msg: 'password salah',
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function auth(req, res) {
  try {
    let username = req.username;

    const user = await UserModel.findOne({
      where: {
        username: username,
      },
    });

    if (user !== undefined) {
      if (user === null) {
        return res.status(404).json({
          status: 'Fail',
          msg: 'Username tidak ditemukan',
        });
      }

      const token = jwt.sign(
        {
          id: req?.id,
          username: user?.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );
      res.json({
        status: 'Success',
        msg: 'successfully login',
        token: token,
        user: user,
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  register,
  login,
  auth,
};
