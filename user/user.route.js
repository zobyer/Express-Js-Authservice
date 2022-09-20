const express = require("express")
const router = express.Router() // eslint-disable-line new-cap

const UserControl = require("./user.controller")

router.route("/").get(UserControl.load)

module.exports = router
