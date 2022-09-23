const yup = require("yup");

module.exports = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required("Please Enter your password"),
});
