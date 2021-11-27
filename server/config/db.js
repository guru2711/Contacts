const mongoose = require("mongoose")
const config = require("config")
const db = config.get("mongoURI")

const connectDB = async () => {
    try {
      await  mongoose.connect(db, () => {
            console.log("Connected to mongoDB")
        })
    } catch (error) {
        console.log(error)
    }
  
}

module.exports = connectDB