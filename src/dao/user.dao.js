const Mongo = require('../../lib/mongo').Connection

class UserDao {
  static getByLogin(login) {
    return Mongo.collection('user').findOne({ login })
  }

  static createUser(login, password) {
    return Mongo.collection("user").insertOne({ login: login, password: password })
  }

  static putToken(id, token) {
    return Mongo.collection("user").updateOne({ _id: Mongo.oid(id) },
      { "$set": { token: token } },)
  }

  static destroyToken(login) {
    return Mongo.collection("user").updateOne({ login: login },
      { "$set": { token: ' ' } },)
  }
}
module.exports = UserDao