const { request } = require('express')
const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const Todo = require("../dao/todo.dao")
const User = require("../dao/user.dao")
const jwt = require('../../lib/jwt')

router.get("/allTodos", getAllTodos)

router.post("/createTodo", createTodo)

router.put('/updateTodoStatus', jwt, updateTodoStatus)
router.put('/updateTodoContent', jwt, updateTodoContent)

module.exports = router

async function getAllTodos(req, res) {
  if (req.query.sort !== '' || req.query.checked === 'true') {
    try {

      let todos = await Todo.getSortedByStatus(req.query.page, req.query.sort, req.query.checked)
      let total = await Todo.getTotalNumber()
      res.send({ todos, total })
    } catch (e) {
      console.log(e);
      res.send({ status: 'success' })
    }
  } else {
    try {
      let todos = await Todo.getAllTodos(req.query.page)
      let total = await Todo.getTotalNumber()
      res.send({ todos, total })
    } catch (e) {
      console.log(e);
      res.send({ status: 'success' })
    }
  }
}

async function createTodo(req, res) {
  try {
    const errors = validationResult(req)
    console.log(errors);
    if (!errors.isEmpty()) {
      res.send({ status: 'validadtion error' })
    }
    await Todo.createTodo(req.body)
    res.send({ status: 'success' })
  } catch (e) {
    console.log(e);
    res.send({ status: 'error' })
  }
}

async function updateTodoStatus(req, res) {
  const { login } = req.body
  try {
    let user = await User.getByLogin(login)
    if (user.token === req.headers.authorization.split(' ')[1]) {
      await Todo.updateTodoStatus(req.body)
      res.send({ status: 'success' })
    } else {
      res.send({ status: 'token expired' })
    }
  } catch (e) {
    console.log(e);
    res.send({ status: 'error' })
  }
}

async function updateTodoContent(req, res) {
  const { login } = req.body
  try {
    let user = await User.getByLogin(login)
    if (user.token === req.headers.authorization.split(' ')[1]) {
      await Todo.updateTodoContent(req.body)
      res.send({ status: 'success' })
    } else {
      res.send({ status: 'token expired' })
    }
  } catch (e) {
    console.log(e);
    res.send({ status: 'error' })
  }
}

