const User = require("../model/user.model");

class AuthUser {
  constructor(username) {
    this.userName = username;
  }

  async findUserByuserName() {
    console.log(this.userName);
    try {
      const userDetails = await User.findOne({
        email: this.userName,
      }).exec();
      return userDetails;
    } catch (error) {
      return error;
    }
  }

  static userBasicDetails(user) {}
}

module.exports = AuthUser;
