const ApiError = require("./api.error");

function apiErrorHandler(err, req, res, next) {
  // in prod, don't use console.error or console.log
  // because it is not async
  if (err instanceof ApiError) {
    return res.status(err.code).json(err);
  }

  return res.status(500).json("something went wrong");
}

module.exports = apiErrorHandler;
