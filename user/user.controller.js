const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./model/user.model");
const RefreshToken = require("./model/refresh-token.model");
const AuthUser = require("./base-class/user");
const Token = require("./base-class/token");
const ApiError = require("../error/api.error");
const ApiSuccess = require("../success/api.success");

async function create(req, res) {
  try {
    const reqUser = new AuthUser(req.body.username);
    const existingUser = await reqUser.findUserByuserName();

    if (existingUser != null) {
      const apiError = ApiError.badRequest("User already exists");
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

async function login(req, res) {
  const body = req.body;
  const reqUser = new AuthUser(body.username);
  try {
    const existingUser = await reqUser.findUserByuserName();
    if (existingUser == null) {
      const apiError = ApiError.badRequest("User not Found");
      return res.status(409).json(apiError);
    }
    const validPassword = await bcrypt.compare(
      body.password,
      existingUser.password
    );

    if (!validPassword) {
      return res.status(401).json(ApiError.badRequest("Invalid Credentials"));
    }

    const accessToken = Token.generateAccessToken({
      name: existingUser.username,
    });

    const refreshToken = Token.generateRefreshToken(
      existingUser,
      body.ip_address
    );

    await refreshToken.save();

    const successResponse = {
      username: body.username,
      access_token: accessToken,
      refreshToken: refreshToken.token,
    };
    return res.status(200).json(ApiSuccess.successRequest(successResponse));
  } catch (error) {
    return res.send(error);
  }
}

async function generateNewAccessToken(req, res) {
  const body = req.body;
  try {
    const existingRefreshToken = await RefreshToken.findOne({
      token: body.refresh_token,
    })
      .populate("user")
      .exec();

    if (existingRefreshToken == null) {
      return res.status(403).json(ApiError.forbidden("Invalid token"));
    }
    const accessToken = Token.generateAccessToken({
      name: existingRefreshToken.user.username,
    });

    const successResponse = {
      username: existingRefreshToken.user.username,
      access_token: accessToken,
      refreshToken: existingRefreshToken.token,
    };
    return res.json(ApiSuccess.successRequest(successResponse));
  } catch (error) {
    return res.send(error);
  }
}

function logout(req, res) {
  console.log("called controller", req.body);

  return res.send("logout response");
}

module.exports = { login, create, generateNewAccessToken, logout };
