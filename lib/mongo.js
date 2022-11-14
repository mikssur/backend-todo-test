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

Connection.url = 'mongodb+srv://user:pass@cluster0.pnktv7l.mongodb.net/todo?retryWrites=true&w=majority'
Connection.options = {

  useNewUrlParser: true
}



module.exports = { Connection }