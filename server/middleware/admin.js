const config = require("config");

module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!config.get("requiresAuth")) return next();

  if (req.user.roles && !req.user.roles.admin) {
    return res.status(403).send("Access denied.");
  }

  next();
};
