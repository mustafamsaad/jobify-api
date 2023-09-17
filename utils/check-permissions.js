const { Unauthenticated } = require("../errors");

const checkPermission = (requestUser, resourceUserId) => {
  // if (resourceUserId.role === "admin") return;

  if (requestUser.userId === resourceUserId.toString()) return;

  throw new Unauthenticated("You are not allowed to this route");
};

module.exports = checkPermission;
