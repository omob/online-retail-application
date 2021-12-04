const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const SubscriptionPlanSchema = new Schema({
  name: String,
  duration: Number,
});

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);

module.exports = { SubscriptionPlan };
