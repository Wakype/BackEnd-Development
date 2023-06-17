const express = require('express');
const path = require('path');
const fs = require('fs');
const validationResultMiddleware = require('../middleware/validationResult');
const {
  jwtValidateMiddleware,
} = require('../middleware/jwtValidateMiddleware');
const { loginAuth, authMe } = require('../controllers/authController');
const paginationMiddleware = require('../middleware/pageSizeMiddleware');
const { listUserChat } = require('../controllers/userController');
const { generateCode, getMessageList, generateGroupCode, saveGroupMessage, getGroupMessageList, listGroupChat } = require('../controllers/chatController');

const routers = express.Router();

routers.post('/login', loginAuth);

routers.use(jwtValidateMiddleware);
routers.use(paginationMiddleware)

routers.get('/authme', authMe);

// Direct Message
routers.post('/chat/message-list', getMessageList);
routers.get('/chat/listchat-user', listUserChat)
routers.post('/chat/generateCode', generateCode)

// Group Message
routers.post('/chat/generateGroupCode', generateGroupCode)
routers.post('/chat/groupMessage-list', getGroupMessageList)
routers.get('/chat/listGroup', listGroupChat)

module.exports = routers;
