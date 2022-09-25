const jwt = require("jsonwebtoken");
const ApiError = require("../error/api.error");

function authenticateRequestToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token == undefined) {
      next(ApiError.unauhtroize("Invalid request"));
    }

    let user = {};
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      console.log(err);
      if (err != null) {
        next(ApiError.forbidden("Invalid token"));
      }
      req.body.user = decoded;
    });

    next();
  } catch (error) {
    next(ApiError.unauhtroize(error.errors[0]));
  }
}

module.exports = authenticateRequestToken;
