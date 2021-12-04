const { User } = require("../models/user");
const { Roles } = require("../models/roles");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Joi = require("joi");

const validateLogin = (requestBody) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(requestBody, schema);
};

const getUserRoles = async (user) => {
  const response = (await Roles.findOne({})).toObject();

  const userRoles = {};

  // find user roles
  Object.keys(response).map((key) => {
    if (typeof response[key] === "object" && key !== "_id") {
      try {
        let userIndex;
        userRoles[key] = Array.from(response[key]).map((userInDb, index) => {
          if (userInDb.userId === ObjectId(user._id).toHexString()) {
            userIndex = index;
            return true;
          }
        })[userIndex];
      } catch (e) {}
    }
  });

  return userRoles;
};

const login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password."); // just to make imposter think both is wrong

  const validPassword = await user.comparePassword(password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  if (!user.canLogin)
    return res
      .status(403)
      .send("Your access has been revoked! Please Contact Admin");

  if (user.isDeleted) return res.status(403).send("Account has been deleted!");

  user.userRoles = await getUserRoles(user);

  const token = user.generateAuthToken();
  res.send(token);
};

module.exports = {
  login,
};
