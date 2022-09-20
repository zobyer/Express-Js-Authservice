const express = require("express")
const router = express.Router() // eslint-disable-line new-cap
const { validate } = require("express-validation")

const UserControl = require("./user.controller")
const UserValidation = require("./user.validation")

router
  .route("/")
  .get(UserControl.load)
  .post(validate(UserValidation.createUser), UserControl.create)

module.exports = router
