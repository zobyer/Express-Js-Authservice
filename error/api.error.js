class ApiError {
  constructor(code, message) {
    this.success = false;
    this.message = message;
    this.code = code;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static forbidden(msg) {
    return new ApiError(403, msg);
  }

  static unauhtroize(msg) {
    return new ApiError(401, msg);
  }
}

module.exports = ApiError;
