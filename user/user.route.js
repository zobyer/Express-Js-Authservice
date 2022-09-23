const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap

const UserController = require("./user.controller");

const validateDto = require("../middleware/validate.request");
const registrationDto = require("../dto/registration");
const loginDto = require("../dto/login");

router
  .route("/registration")
  .post(validateDto(registrationDto), UserController.create);
router.route("/login").post(validateDto(loginDto), UserController.login);

module.exports = router;
