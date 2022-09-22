const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
require("dotenv/config")

const userRoutes = require("./index.router")
const apiErrorHandler = require("./error/api.error-handler")

//Convert request to JSON
app.use(bodyParser.json())

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

//Validation Error
app.use(apiErrorHandler)

//Starting server port
app.listen(process.env.PORT)
