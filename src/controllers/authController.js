require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dayjs = require('dayjs');

const sendEmailHandle = require('../mail');
const UserModel = require('../models').user;
const ForgotPasswordModel = require('../models').password;

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

async function lupaPassword(req, res) {
  try {
    const { email } = req.body;

    // check is user's email signed
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    // if havent sign up give message email doesnt exist
    if (user === null) {
      return res.status(422).json({
        status: 422,
        msg: 'Email tidak ditemukan silahkan register',
      });
    }

    // check if token have been created on that user in forgotPassword table
    const currentToken = await ForgotPasswordModel.findOne({
      where: {
        userId: user?.id,
      },
    });

    // if exist, delete previous token
    if (currentToken !== null) {
      await ForgotPasswordModel.destroy({
        where: {
          userId: user?.id,
        },
      });
    }

    // if havent create token
    const token = crypto.randomBytes(32).toString('hex');
    const date = new Date();
    const expired = date.setHours(date.getHours() + 1);

    await ForgotPasswordModel.create({
      userId: user?.id,
      token: token,
      expiredDate: dayjs(expired).format('YYYY-MM-DD hh:mm:ss'),
    });

    const context = {
      link: `${process.env.MAIL_CLIENT_URL}/reset-password/${user?.id}/${token}`,
    };
    const sendEmail = await sendEmailHandle(
      email,
      'Lupa Password',
      'resetPassword',
      context
    );

    if (sendEmail === 'success') {
      res.json({
        status: 'success',
      });
    } else {
      res.status(400).json({
        status: 'gagal',
        msg: 'gunakan email yg terdaftar',
      });
    }
  } catch (err) {
    console.log('err =>', err);
    res.status(403).json({
      status: 'error 403',
      msg: 'ada error',
      err: err,
    });
  }
}

async function resetPassword(req, res) {
  try {
    let { newPassword } = req.body;
    let { userId, token } = req.params;
    const currentToken = await ForgotPasswordModel.findOne({
      where: { userId: userId, token: token },
    });

    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    if (currentToken === null) {
      res.status(403).json({
        msg: 'token invalid',
      });
    } else {
      let userExpired = currentToken.expiredDate;
      let expire = dayjs(Date());
      let difference = expire.diff(userExpired, 'hour');
      if (difference !== 0) {
        res.json({
          status: 'Fail',
          msg: 'Token has expired',
        });
      } else {
        let hashPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.update(
          { password: hashPassword },
          {
            where: {
              id: user.id,
            },
          }
        );
        await ForgotPasswordModel.destroy({ where: { token: token } });
        res.json({
          status: '200 OK',
          msg: 'password updated',
        });
      }
    }
  } catch (err) {
    console.log('err', err);
    res.status(403).json({
      status: 'error 403',
      msg: 'ada error',
      err: err,
      // token: currentToken
    });
  }
}
module.exports = { registerAuth, loginAuth, lupaPassword, resetPassword };
