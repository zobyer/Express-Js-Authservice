const yup = require("yup");

module.exports = yup.object().shape({
  email: yup.string().trim().email().required(),
  password: yup.string().required("Please Enter your password"),
});
