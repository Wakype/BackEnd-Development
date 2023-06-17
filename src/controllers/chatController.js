const { Op } = require('sequelize');
const crypto = require('crypto');
const roomModel = require('../models').chatRoom;
const userModel = require('../models').user;
const convModel = require('../models').conversation;
const groupRoomModel = require('../models').groupRoom;
const groupModel = require('../models').group;
const models = require('../models');
const convGroupModel = require('../models').conversationGroup;

async function generateCode(req, res) {
  const send = req.id;
  const username1 = req.username;
  const username2 = req.body.username_penerima;
  let roomCode = crypto.randomBytes(24).toString('hex');

  try {
    const code = await roomModel.findOne({
      attributes: ['id', 'username1', 'username2', 'chatRoom'],
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ username1: username1 }, { username2: username2 }],
          },
          {
            [Op.and]: [{ username1: username2 }, { username2: username1 }],
          },
        ],
      },
    });

    if (code === null) {
      await roomModel.create({
        username1: username1,
        username2: username2,
        chatRoom: roomCode,
      });

      return res.json({
        status: 'Success',
        msg: 'OK 1',
        data: {
          username1,
          username2,
          roomCode,
        },
      });
    } else {
      return res.json({
        status: 'Success',
        msg: 'OK 2',
        data: {
          code,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

async function saveMessage(data) {
  try {
    await convModel.create({
      sender: data.sender,
      to: data.to,
      message: data.message,
      roomCode: data.roomCode,
    });
  } catch (err) {
    console.log(err);
  }
}

async function getMessageList(req, res) {
  try {
    const messageList = await convModel.findAll({
      where: {
        roomCode: req.body.room,
      },
      order: [['id', 'DESC']],
    });

    return res.json({
      msg: 'Success',
      data: messageList,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: 'Fail',
      msg: err.message,
    });
    return res.sendStatus(403);
  }
}

async function generateGroupCode(req, res) {
  const username = req.username;
  const group = req.body.group;
  let roomCode = crypto.randomBytes(24).toString('hex');

  try {
    const code = await groupRoomModel.findAll({
      where: {
        group: group,
      },
    });

    if (code?.length === 0) {
      console.log('kosong');
      // await groupModel.create({
      //   username: username,
      //   group: group,
      //   chatRoom: roomCode,
      // });

      return res.json({
        status: 'Success',
        msg: 'OK 1',
        data: {
          username,
          group,
          roomCode,
        },
      });
    } else {
      return res.json({
        status: 'Success',
        msg: 'OK 2',
        data: {
          code,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

async function saveGroupMessage(data) {
  console.log('save message', data);
  try {
    await convGroupModel.create({
      sender: data.sender,
      to: data.to,
      message: data.message,
      roomCode: data.roomCode,
    });
  } catch (err) {
    console.log(err);
  }
}

async function getGroupMessageList(req, res) {
  try {
    const messageList = await convGroupModel.findAll({
      where: {
        roomCode: req.body.room,
      },
      order: [['id', 'DESC']],
    });

    return res.json({
      msg: 'Success',
      data: messageList,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: 'Fail',
      msg: err.message,
    });
    return res.sendStatus(403);
  }
}

async function listGroupChat(req, res) {
  try {
    const groupList = await groupModel.findAll({
      include: [
        {
          model: models.groupRoom,
          require: true,
          as: 'grouproom',
        },
      ],
    });

    res.json({
      status: 'Success',
      msg: 'OK',
      data: groupList,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

module.exports = {
  generateCode,
  saveMessage,
  getMessageList,
  generateGroupCode,
  saveGroupMessage,
  getGroupMessageList,
  listGroupChat,
};
