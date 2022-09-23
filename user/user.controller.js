const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./user.model");
const AuthUser = require("./base-class/user");
const ApiError = require("../error/api.error");
const ApiSuccess = require("../success/api.success");

function load(req, res) {
  return res.json(req.query);
}

async function create(req, res) {
  try {
    const reqUser = new AuthUser(req.body.username);
    const existingUser = await reqUser.findUserByuserName();

    if (existingUser.length > 0) {
      const apiError = ApiError.badRequest("user already exists");
      return res.status(409).json(apiError);
    }
  } catch (error) {
    return res.send(error);
  }

  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    password: hashedPwd,
    service_name: req.body.service_name,
    service_id: req.body.service_id,
  });

  try {
    // const doesUserExists = await User.find({ username: req.body.username });

    const savedUser = await user.save();
    return res.status(200).json(ApiSuccess.successRequest(savedUser));
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
}

module.exports = { load, create };
