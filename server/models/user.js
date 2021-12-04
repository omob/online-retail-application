const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    email: true,
    maxlength: 255,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    postalCode: String,
  },
  subscriptions: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
  },
  creditCard: {
    default: {},
    cardNo: String,
    brand: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  canLogin: {
    type: Boolean,
    default: true,
  },
  cardAuthorization: { type: Object },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: {
        firstName: this.name.firstName,
        lastName: this.name.lastName,
      },
      email: this.email,
      roles: this.userRoles,
    },
    config.get("jwtPrivateKey"),
    {
      expiresIn: config.get("tokenExpiration"),
    }
  );

  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phoneNumber: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    addressline1: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    role: Joi.string(),
  };

  return Joi.validate(user, schema);
}

function validateUserOnUpdate(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    addressline1: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
  };

  return Joi.validate(user, schema);
}

function validatePassword(password) {
  const schema = {
    password: Joi.string().min(6).required(),
  };

  return Joi.validate(password, schema);
}

module.exports = {
  User,
  validateUser,
  validateUserOnUpdate,
  validatePassword,
};
