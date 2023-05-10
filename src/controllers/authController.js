const { login, auth } = require('../service/auth-service');

require('dotenv').config();

// async function registerAuth(req, res) {
//   let payload = req.body;
//   let { password, username, role } = payload;

//   register({ password, username, role })
//     .then((result) => {
//       console.log('resultnya', result);
//       res.status(201).json({
//         status: 'Success',
//         msg: 'register successfully',
//       });
//     })
//     .catch((err) => {
//       res.status(403).json({
//         status: 'Fail',
//         msg: err.message,
//       });
//     });
// }
async function loginAuth(req, res) {
  try {
    let payload = req.body;
    let { username, password } = payload;

    login({ username, password, req, res });
  } catch (err) {
    res.status(403).json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

async function authMe(req, res) {
  try {
    auth(req, res);
  } catch (err) {
    console.log(err)
    res.status(403).json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

module.exports = { loginAuth, authMe };
