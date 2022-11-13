const express = require('express')
const router = express.Router()
let bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const User = require("../dao/user.dao")
const { secret, refresh } = require('../../config')

router.post("/login", login)
router.post("/signup", createAccount)
router.post('/checkToken', checkToken)

router.put("/logout", logout)

module.exports = router

const generateAccessToken = (id) => {
  const payload = {
    id
  }
  return jwt.sign(payload, secret, { expiresIn: '2h' })
}

async function login(req, res) {
  const { login, password } = req.body
  try {
    let user = await User.getByLogin(login)
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateAccessToken(user._id)
      await User.putToken(user._id, token)
      res.send({ token: token, status: 'success' })
    } else {
      res.send({ status: 'error' })
    }
  } catch (e) {
    console.log(e);
    res.send({ status: 'error' })
  }
}

async function createAccount(req, res) {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    try {
      await User.createUser(req.body.login, hash)
      res.send({ status: 'success' })
    } catch (e) {
      console.log(e);
      res.send({ status: 'error' })
    }
  });
}

async function logout(req, res) {
  const { login } = req.body
  try {
    await User.destroyToken(login)
    res.send({ status: 'success' })
  } catch (e) {
    console.log(e);
    res.send({ status: 'error' })
  }
}

async function checkToken(req, res) {
  const { login } = req.body
  try {
    let user = await User.getByLogin(login)
    if (req.headers.authorization !== '' && user.token === req.headers.authorization.split(' ')[1]) {
      res.send({ status: 'success' })
    } else {
      res.send({ status: 'error' })
    }
  } catch (e) {
    console.log(e);
    res.send({ status: 'error' })
  }
}

