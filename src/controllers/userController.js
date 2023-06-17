const { reset } = require('nodemon');
const { Op } = require('sequelize');
const userModel = require('../models').user;

async function listUserChat(req, res) {
  try {
    const user = await userModel.findAll({
      where: {
        id: {
          [Op.ne]: req.id,
        },
      },
    });
    res.json({
      status: 'Success',
      msg: 'OK',
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

module.exports = {
  listUserChat,
};
