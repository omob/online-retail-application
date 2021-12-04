const { SubscriptionPlan } = require("../models/subscriptionPlans");
const { Subscription } = require("../models/subscription");

const fetchSubscriptionPlans = async (req, res) => {
  const plans = await SubscriptionPlan.find({});
  res.send(plans);
};

const createPlan = async (req, res) => {
  const { error } = validateSubscriptionPlans(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, duration } = req.body;
  const plans = new SubscriptionPlan({
    name,
    duration,
  });

  await plans.save();
  res.send("Created");
};

const fetchAllUsersWithSubscriptions = async (req, res) => {
  const result = await Subscription.find({})
    .populate({
      path: "subscriptions.productId",
      model: "Product",
    })
    .populate({
      path: "subscriptions.subscriptionPlan",
      model: "SubscriptionPlan",
    })
    .populate({
      path: "userId",
      model: "User",
      select: "-password -creditCard",
    });

  const userSubscriptions = result.filter(
    (sub) =>
      (sub.subscriptions.length > 0 ? sub : null) &&
      (sub.userId.isDeleted == null || !sub.userId.isDeleted)
  );
  res.send(userSubscriptions);
};

const fetchAllUsersWithSubscriptionsForCronJob = async () => {
  const result = await Subscription.find({})
    .populate({
      path: "subscriptions.productId",
      model: "Product",
    })
    .populate({
      path: "subscriptions.subscriptionPlan",
      model: "SubscriptionPlan",
    })
    .populate({
      path: "userId",
      model: "User",
      select: "-password",
    });

  const userSubscriptions = result.filter((sub) =>
    sub.subscriptions.length > 0 ? sub : null
  );
  return userSubscriptions;
};

const fetchAllUserSubscriptions = async (req, res) => {
  const result = await Subscription.findOne({
    userId: req.params.id,
  })
    .populate({
      path: "userId",
      model: "User",
    })
    .populate({
      path: "subscriptions.productId",
      model: "Product",
    })
    .populate({
      path: "subscriptions.subscriptionPlan",
      model: "SubscriptionPlan",
    });

  res.send(
    (result && {
      user: result.userId.name,
      subscriptions: result.subscriptions,
    }) ||
      null
  );
};

function validateSubscriptionPlans(requestBody) {
  const schema = {
    name: Joi.string().required(),
    duration: Joi.number().required(),
  };
  return Joi.validate(requestBody, schema);
}

module.exports = {
  fetchSubscriptionPlans,
  createPlan,
  fetchAllUsersWithSubscriptions,
  fetchAllUserSubscriptions,
  fetchAllUsersWithSubscriptionsForCronJob,
};
