const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap

const UserControl = require("./user.controller");
const UserValidation = require("./user.validation");

const validateDto = require("../middleware/validate.registration");
const devDto = require("../dto/registration");

router
  .route("/registration")
  .get(UserControl.load)
  .post(validateDto(devDto), UserControl.create);

module.exports = router;
