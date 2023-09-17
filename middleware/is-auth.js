const { Unauthenticated } = require("../errors");

const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new Unauthenticated("Authentication invalid");
  }

  const token = authHeaders.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new Unauthenticated("Authentication invalid");
  }
};

module.exports = isAuth;
