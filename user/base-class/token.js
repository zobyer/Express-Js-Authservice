const jwt = require("jsonwebtoken");
const RefreshToken = require("../model/refresh-token.model");
require("dotenv/config");

class Token {
  constructor() {}

  static generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "500s",
    });
  }

  static generateRefreshToken(user, ipAddress) {
    console.log("existing user ", user._id);

    const token = jwt.sign(
      { name: user.username },
      process.env.REFRESH_TOKEN_SECRET
    );
    try {
      const refreshToken = new RefreshToken({
        user: user._id,
        token: token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress,
      });
      return refreshToken;
    } catch (error) {
      console.log("error");
    }
  }

  static async getRefreshTokenByUserId(userId) {
    const refreshToken = await RefreshToken.findOne({ user: userId })
      .populate("user")
      .exec();
    return refreshToken;
  }
}

module.exports = Token;
