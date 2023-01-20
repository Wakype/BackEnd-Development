const moment = require('moment');

const log = (req, res, next) => {
  console.log(
    `✨ ➤➤➤ Audit Log: ${moment().date()}/${moment().month()}/${moment().year()} - ${moment().calendar()} || ${
      req.ip
    } || http:localhost:8081/${req.originalUrl}`
  );
  next();
};

module.exports = log;