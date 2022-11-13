const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

class Connection {
  static connectToMongo() {
    if (this.db) return Promise.resolve(this.db)
    return MongoClient.connect(this.url, this.options)
      .then(db => this.db = db)
  }

  static collection(name, database) {
    return Connection.db.db(database || 'todo').collection(name)
  }

  static oid(id) {
    return new ObjectId(id)
  }
}

Connection.db = null
Connection.url = 'mongodb://127.0.0.1:27017/todo'
Connection.options = {

  useNewUrlParser: true
}



module.exports = { Connection }