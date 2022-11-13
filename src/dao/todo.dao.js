const Mongo = require('../../lib/mongo').Connection

class TodoDao {
  static getAllTodos(currentPage) {
    return Mongo.collection('todos').find().sort({ _id: -1 }).skip(currentPage * 3).limit(3).toArray()
  }

  static getSortedByStatus(currentPage, sortType, reverse) {
    let order = reverse === 'false' ? -1 : 1
    if (sortType === 'userName') {
      return Mongo.collection('todos').find().sort({ userName: -order }).skip(currentPage * 3).limit(3).toArray()
    } else if (sortType === 'userEmail') {
      return Mongo.collection('todos').find().sort({ userEmail: -order }).skip(currentPage * 3).limit(3).toArray()
    } else if (sortType === 'status') {
      return Mongo.collection('todos').find().sort({ status: order }).skip(currentPage * 3).limit(3).toArray()
    } else {
      return Mongo.collection('todos').find().sort({ _id: order }).skip(currentPage * 3).limit(3).toArray()
    }
  }

  static getTotalNumber() {
    return Mongo.collection('todos').countDocuments()
  }

  static createTodo(data) {
    const { content, userName, userEmail, status } = data

    return Mongo.collection("todos").insertOne({ content, userName, userEmail, status })
  }

  static updateTodoStatus({ id, status }) {
    return Mongo.collection("todos").updateOne(
      { _id: Mongo.oid(id) },
      { "$set": { status: status } }
    )
  }

  static updateTodoContent({ content, id }) {
    return Mongo.collection("todos").updateOne(
      { _id: Mongo.oid(id) },
      { "$set": { content: content, edit: true } },
    )
  }
}

module.exports = TodoDao