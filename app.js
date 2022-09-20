const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const expressValidation = require("express-validation")

const userRoutes = require("./index.router")
const APIError = require("./helpers/APIError")
require("dotenv/config")

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
// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    console.log()
    const unifiedErrorMessage = err.errors
      .map((error) => error.messages.join(". "))
      .join(" and ")
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

//Starting server port
app.listen(process.env.PORT)
