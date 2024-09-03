import mongoose from "mongoose";
import 'dotenv/config'
import dev from '../configs/config.mongodb.js'

const { db } = dev

const connectionString = `mongodb+srv://${db.username}:${db.password}@${db.name}.no1iute.mongodb.net/?retryWrites=true&w=majority&appName=${db.name}`

class DbConnection {
  constructor() {
    this.connectDb()
  }

  connectDb(dbType = "mongodb") {
    switch (dbType) {
      case "mongodb":
        this.connectToMongoDB()
        break
      case "mysql":
        break
      default:
    }
  }

  connectToMongoDB() {
    mongoose.set('debug', {
      color: true,
    })
    mongoose.connect(connectionString, {maxPoolSize: 50,}).then(() => {
      console.log('Connected MongoDB success!!')
    }).catch((err) => console.log('Error connecting!! Error: ', err))
  }
  
  static getInstance() {
    if (!DbConnection.instance) {
      DbConnection.instance = new DbConnection()
    }

    return DbConnection.instance
  }
}

const dbConnection = DbConnection.getInstance()
export default dbConnection
