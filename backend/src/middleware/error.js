export default function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const body = {
    error: err.code || 'internal_error',
    message: err.message || 'Something went wrong'
  }
  res.status(status).json(body)
}

