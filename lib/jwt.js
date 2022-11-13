const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    if (req.headers.authorization === undefined) {
      return res.send({ status: 'No token' })
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.send({ status: 'Not authorized' })
    }
    const decodedData = jwt.verify(token, secret)
    req.user = decodedData
    next()
  } catch (e) {
    console.log(e);
    return res.send({ status: 'Not authorized' })
  }
}