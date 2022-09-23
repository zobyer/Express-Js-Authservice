const User = require("../user.model");

class AuthUser {
  constructor(username) {
    this.userName = username;
  }

  async findUserByuserName() {
    try {
      const userDetails = await User.findOne({
        username: this.userName,
      }).exec();
      return userDetails;
    } catch (error) {
      return error;
    }
  }
}

module.exports = AuthUser;
