require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models').user;

async function registerAuth(req, res) {
  try {
    let payload = req.body;
    let { nama, email, password } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama: nama,
      email: email,
      password: hashPassword,
    });
    res.json({
      status: 'success',
      msg: 'successfully registered',
    });
  } catch (err) {
    res.status(403).json({
      status: 'error',
      msg: 'failed to register',
    });
  }
}

async function loginAuth(req, res) {
  try {
    let payload = req.body;
    let { email, password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: 422,
        msg: 'Email tidak ditemukan silahkan register',
      });
    }
    if (password === null) {
      return res.status(422).json({
        status: 422,
        msg: 'Email & Password tidak dicocok',
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (!verify) {
      return res.status(422).json({
        status: 422,
        msg: 'Email & Password tidak dicocok',
      });
    }

    const token = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      status: 'success',
      msg: 'successfully login',
      token: token,
      user: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'error',
      msg: 'failed to login',
    });
  }
}

module.exports = { registerAuth, loginAuth };
