const yup = require("yup");

module.exports = yup.object().shape({
  //username: yup.string().required().min(5).max(30),
  name: yup.string().trim().required().min(5).max(50),
  password: yup
    .string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  email: yup.string().trim().email().required(),
  dateOfBirth: yup.date().required(),
  // service_name: yup.string().trim().required(),
  // service_id: yup.number().required(),
  //   dob: yup.date().required(),
  //   countryCode: yup.string().trim().min(2).max(2).default("US"),
});
