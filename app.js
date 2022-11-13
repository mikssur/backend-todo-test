const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000
const Connection = require('./lib/mongo').Connection
const bodyParser = require('body-parser')
const { check } = require('express-validator')

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString("utf-8")
  }
}));
app.use(bodyParser.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}));
app.use(bodyParser.raw())
app.use(cors())

app.get('/', (req, res) => {
  res.send('')
})

app.use('/todo', [check('userName', 'Cant be empty').notEmpty(), check('userEmail', 'Cant be empty or incorrect email').notEmpty(), check('content', 'Cant be empty').notEmpty()], require('./src/controller/todo.controller'))
app.use('/auth', require('./src/controller/login.controller'))

Connection.connectToMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch(console.error)
