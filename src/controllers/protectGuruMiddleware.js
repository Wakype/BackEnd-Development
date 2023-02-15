const protectGuruMiddleware = (req, res, next) => {
  const role = req.role;
  console.log('Role => ', role);

  if (role !== 'Guru') {
    return res.status(403).json({
      err: 'unauthorized',
      msg: 'anda bukan guru',
    });
  } else {
    next();
  }
};

module.exports = protectGuruMiddleware;
