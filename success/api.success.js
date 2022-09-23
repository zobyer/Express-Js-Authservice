class ApiSuccess {
  constructor(code, data) {
    this.success = true;
    this.data = data;
    this.code = code;
  }

  static successRequest(data) {
    return new ApiSuccess(200, data);
  }
}

module.exports = ApiSuccess;
