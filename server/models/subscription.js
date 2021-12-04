const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  userId: Schema.Types.ObjectId,
  subscriptions: {
    type: Array,
    _id: Schema.Types.ObjectId,
    subscriptionPlan: Schema.Types.ObjectId,
    productId: Schema.Types.ObjectId,
    billingDay: String,
    subscriptionDate: Date,
    createdDate: Date,
  },
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = { Subscription };
