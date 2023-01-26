const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'terjadi kesalahan pada server',
    err: err
  });
};

module.exports = errorHandler;