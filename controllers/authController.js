const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");

const { BadRequestError, Unauthenticated } = require("../errors");

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError("please fill in all fields");
  }

  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  const user = await User.create(req.body);
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      location: user.location,
      lastName: user.lastName,
    },
    token,
    location: user.location,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please fill in all fields");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Unauthenticated("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Unauthenticated("Invalid credentials");
  }

  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

exports.updateUser = async (req, res) => {
  const { email, name, location, lastName } = req.body;
  const userId = req.user.userId;

  if (!email || !name || !location || !lastName) {
    throw new BadRequestError("please fill in all fields");
  }

  const user = await User.findOne({ _id: userId });

  user.email = email;
  user.name = name;
  user.location = location;
  user.lastName = lastName;
  await user.save();

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
