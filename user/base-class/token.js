const jwt = require("jsonwebtoken");
require("dotenv/config");

class Token {
  constructor() {}

  static generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15s",
    });
  }

  static generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  }
}

module.exports = Token;
