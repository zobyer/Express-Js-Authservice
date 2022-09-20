const express = require("express")

const router = express.Router() // eslint-disable-line new-cap
const userRoutes = require("./user/user.route")

// mount user routes at /users
router.use("/v1", userRoutes)

module.exports = router
