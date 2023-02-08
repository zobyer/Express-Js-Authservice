const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./model/user.model");
const RefreshToken = require("./model/refresh-token.model");
const dayjs = require("dayjs");

const AuthUser = require("./base-class/user");
const Token = require("./base-class/token");
const ApiError = require("../error/api.error");
const ApiSuccess = require("../success/api.success");
const { modifyUser } = require("../helper/modifyUser");

async function create(req, res) {
  try {
    const reqUser = new AuthUser(req.body.email);
    const existingUser = await reqUser.findUserByuserName();
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
  } catch (error) {
    return res.send(error);
  }

  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  const user = new User({
    id: req.body.id,
    name: req.body.name,
    password: hashedPwd,
    email: req.body.email,
    date_of_birth: dayjs(req.body.dateOfBirth).format("YYYY-MM-DD hh:mm A"),
  });

  try {
    // const doesUserExists = await User.find({ username: req.body.username });

    const savedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: modifyUser(savedUser),
    });
  } catch (error) {
    // console.log(error);
    return res.send(error);
  }
}

async function login(req, res) {
  const body = req.body;
  const reqUser = new AuthUser(body.email);
  try {
    const existingUser = await reqUser.findUserByuserName();
    if (!existingUser) {
      //      const apiError = ApiError.badRequest("User not Found");
      return res
        .status(409)
        .json({ success: false, message: "User not found" });
    }
    const validPassword = await bcrypt.compare(
      body.password,
      existingUser.password
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // const accessToken = Token.generateAccessToken({
    //   name: existingUser.username,
    // });

    // const refreshToken = Token.generateRefreshToken(
    //   existingUser,
    //   body.ip_address
    // );

    //  await refreshToken.save();

    const successResponse = {
      success: true,
      message: "Logged In Successfully",
      user: modifyUser(existingUser),
    };
    return res.status(200).json(successResponse);
  } catch (error) {
    return res.send(error);
  }
}

async function checkIfNewUser(req, res) {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    }).exec();

    if (existingUser) {
      return res.status(200).json({
        success: true,
        isNewUser: false,
        message: "User exists",
      });
    }
    return res.status(200).json({
      success: true,
      isNewUser: true,
      message: "This is a new user",
    });
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
    } else if (!existingRefreshToken.isActive) {
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

async function logout(req, res) {
  try {
    const user = new AuthUser(req.body.user.name);
    const authUser = await user.findUserByuserName();
    const refreshToken = await Token.getRefreshTokenByUserId(authUser._id);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = req.body.ip_address;
    await refreshToken.save();

    return res.json(ApiSuccess.successRequest("Successfully logged out"));
  } catch (error) {
    return res.send(error);
  }
}

async function clearDB(req, res) {
  try {
    await User.deleteMany();
    return res.status(200).json({ success: true, message: "DB cleared" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = {
  login,
  create,
  generateNewAccessToken,
  logout,
  checkIfNewUser,
  clearDB,
};
