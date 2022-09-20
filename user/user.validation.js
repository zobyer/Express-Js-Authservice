const { validate, ValidationError, Joi } = require("express-validation")

module.exports = {
  createUser: {
    body: Joi.object({
      email: Joi.string().required(),
    }),
  },
}
