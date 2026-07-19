function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(error);
  const duplicate = error.code === 'ER_DUP_ENTRY';
  const statusCode = error.statusCode || (duplicate ? 409 : 500);
  res.status(statusCode).json({
    message: statusCode === 500 ? 'An unexpected server error occurred.' : duplicate ? 'This record conflicts with an existing active record.' : error.message
  });
}

module.exports = { notFound, errorHandler };
