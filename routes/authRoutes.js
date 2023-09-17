const express = require("express");
const router = express.Router();

const { rateLimit } = require("express-rate-limit");

const isAuth = require("../middleware/is-auth");
const authController = require("../controllers/authController");

const apiLimiter = rateLimit({
  windowMs: 1000 * 15 * 60,
  limit: 10,
  message: "Too many requests please try again after 15 minutes",
});

router.route("/register").post(apiLimiter, authController.register);
router.route("/login").post(apiLimiter, authController.login);
router.route("/update-user").patch(isAuth, authController.updateUser);

module.exports = router;
