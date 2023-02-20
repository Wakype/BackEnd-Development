const { Op } = require('sequelize');
const NilaiModel = require('../models').nilai;
const models = require('../models');
const { checkQuery } = require('../utils');

async function getListNilai(req, res) {
  try {
    let { page, pageSize, offset } = req.query;

    const nilai = await NilaiModel.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: models.user,
          require: true,
          as: 'user',
          attributes: ['nama', 'jenisKelamin', 'email'],
        },
      ],
    });

    res.json({
      status: 'success',
      msg: 'List Nilai',
      pagination: {
        page: page,
        pageSize: pageSize,
        jumlah: nilai.rows.length,
        total: nilai.count,
      },
      data: nilai.rows,
      query: {
        page: page,
        pageSize: pageSize,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'error',
      msg: 'ada kesalahan',
    });
  }
}

module.exports = { getListNilai };
