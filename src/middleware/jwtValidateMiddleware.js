const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtValidateMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const bearerHeader = authorization.split(' ');
  const token = bearerHeader[1];

  if (!authorization || authorization === undefined) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        status: 'failed',
        err: token,
      });
    } else {
      req.id = decoded.id;
      req.username = decoded.username;
      next();
    }
  });
};

module.exports = { jwtValidateMiddleware };
