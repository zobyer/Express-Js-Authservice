const express = require("express")
const app = express()
const mongoose = require("mongoose")

const userRoutes = require("./index.router")

require("dotenv/config")

//Routes
app.use("", userRoutes)

//Connect with DB
mongoose.connect(process.env.DB_CONNECTION, (res) => {
  console.log("DB connected")
})

mongoose.connection.on("error", function (err) {
  // Do something
  console.log("error occured while connecting db", err)
})

//Starting server port
app.listen(process.env.PORT)
