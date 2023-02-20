const bcrypt = require('bcrypt');

const artikel = require('../models/artikel');
const { Op } = require('sequelize');

const UserModel = require('../models').user;
const models = require('../models');
const { checkQuery } = require('../utils');

const index = async (req, res) => {
  try {
    let { keyword, page, pageSize, orderBy, sortBy, pageActive } = req.query;

    const users = await UserModel.findAndCountAll({
      attributes: ['id', 'nama', 'email', 'status', 'jenisKelamin'],
      where: {
        ...(keyword !== undefined && {
          [Op.or]: [
            {
              nama: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              jenisKelamin: {
                [Op.like]: `%${keyword}%`,
              },
            },
          ],
        }),
      },
      include: [
        {
          model: models.identitas,
          require: true,
          as: 'identitas',
          attributes: ['id', 'nama', 'alamat', 'tempatLahir', 'tanggalLahir'],
        },
      ],
      order: [[sortBy, orderBy]],
      offset: page,
      limit: pageSize,
    });
    console.log('page', page);
    console.log('pageSize', pageSize);

    return res.json({
      status: 'success',
      msg: 'user successfully',
      pagination: {
        page: pageActive,
        nextPage: page + 1,
        previousPage: page - 1,
        pageSize: pageSize,
        jumlah: users.rows.length,
        total: users.count,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'error',
      msg: 'ada kesalahan',
    });
  }
};

async function getListUser(req, res) {
  try {
    let { mapel } = req.query;
    const users = await UserModel.findAll({
      attributes: ['id', 'nama', 'email', 'jenisKelamin'],
      include: [
        {
          model: models.identitas,
          require: true,
          as: 'identitas',
          attributes: ['id', 'nama', 'alamat', 'tempatLahir', 'tanggalLahir'],
        },
        {
          model: models.nilai,
          require: true,
          as: 'nilai',
          attributes: ['nilai', 'mapel'],
          where: {
            ...(checkQuery(mapel) && {
              mapel: {
                [Op.substring]: mapel,
              },
            }),
          },
        },
      ],
    });
    res.json({
      status: 200,
      msg: 'Data berhasil ditemukan',
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: '404 Not Found',
      msg: 'Ada Kesalahan',
    });
  }
}

async function getDetailUserById(req, res) {
  let { id } = req.params;

  const user = await UserModel.findOne({
    where: {
      id: id,
    },
    attributes: ['id', 'nama', 'email', 'jenisKelamin'],
    include: [
      {
        model: models.identitas,
        require: true,
        as: 'identitas',
        attributes: ['id', 'nama', 'alamat', 'tempatLahir', 'tanggalLahir'],
      },
    ],
  });

  if (user === null) {
    res.status(404).json({
      status: 404,
      msg: 'User not found',
    });
  }
  try {
    res.json({
      status: 200,
      msg: 'Detail successfully',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: '403 Not Found',
      msg: 'ada kesalahan',
    });
  }
}
async function getDetailUserByParams(req, res) {
  let { email } = req.params;

  const user = await UserModel.findOne({
    where: {
      email: email,
    },
  });

  if (user === null) {
    res.status(404).json({
      status: 404,
      msg: 'User not found',
    });
  }
  try {
    res.json({
      status: 200,
      msg: 'Detail successfully',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: '403 Not Found',
      msg: 'ada kesalahan',
    });
  }
}
// create data ke databasee
async function createUser(req, res) {
  try {
    let payload = req.body;
    let { nama, email, tempatLahir, tanggalLahir } = payload;

    await UserModel.create({
      nama: nama,
      email: email,
      isActive: true,
      tempatLahir: tempatLahir,
      tanggalLahir: tanggalLahir,
    });

    res.status(201).json({
      status: 201,
      msg: 'User created successfully',
    });
  } catch (err) {
    res.status(403).json({
      status: '403 Forbidden',
      msg: 'Ada Kesalahan',
    });
  }
}

async function updateUser(req, res) {
  try {
    let { id } = req.params;
    const user = await UserModel.findByPk(id);
    const payload = req.body;
    let { nama, email, tempatLahir, tanggalLahir } = payload;

    if (user === null) {
      res.status(404).json({
        status: 404,
        msg: 'User not found',
      });
    }

    await UserModel.update(
      { nama, email, tempatLahir, tanggalLahir },
      {
        where: {
          id: id,
        },
      }
    );

    res.json({
      status: '200 OK',
      msg: 'User updated',
    });
  } catch (err) {
    res.status(403).json({
      status: 'failed',
      msg: 'ada kesalahan update',
    });
  }
}

async function deleteUser(req, res) {
  try {
    let { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: 404,
        msg: 'User not found',
      });
    }

    await UserModel.destroy({
      where: {
        id: id,
      },
    });

    res.json({
      status: '200 OK',
      msg: 'User deleted',
    });
  } catch (err) {
    res.status(403).json({
      status: 'failed',
      msg: 'ada kesalahan delete',
    });
  }
}

async function updatePassowordUser(req, res) {
  try {
    const payload = req.body;
    let { email, oldPassword, newPassword } = payload;
    const users = await UserModel.findOne({
      where: {
        email: req.email,
      },
    });

    const verify = await bcrypt.compareSync(oldPassword, users.password);

    if (users === null) {
      return res.json({
        status: 404,
        msg: 'email not found',
      });
    }

    if (verify) {
      let hashPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.update(
        { password: hashPassword },
        {
          where: {
            id: users.id,
          },
        }
      );
      res.json({
        status: '200 OK',
        msg: 'password updated',
      });
    } else {
      res.json({
        msg: 'password lama tidak sesuai',
      });
    }
  } catch (err) {
    console.log('err', err);
    res.status(403).json({
      status: 'failed',
      msg: 'ada kesalahan update password',
      err: err,
    });
  }
}

module.exports = {
  getListUser,
  createUser,
  getDetailUserById,
  getDetailUserByParams,
  updateUser,
  deleteUser,
  updatePassowordUser,
};
