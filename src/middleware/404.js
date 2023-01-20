const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'error 404',
    message: 'Not Found',
  });
};

module.exports = notFound;