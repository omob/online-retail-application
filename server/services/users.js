const bcrypt = require("bcrypt");
const Joi = require("joi");
const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
const _ = require("lodash");
const {
  User,
  validateUser,
  validateUserOnUpdate,
  validatePassword,
} = require("../models/user"); // Using User schema in the user route
const { Subscription } = require("../models/subscription");
const { SubscriptionPlan } = require("../models/subscriptionPlans");
const { Product } = require("../models/product");
const { Transactions } = require("../models/transactions");

const Email = require("./email");
const transactionsServices = require("./transactions");
const user = require("../models/user");
const {
  addDaysToDate,
  generateNextBillingDate,
  getDayOfTheWeekFromNumber,
} = require("../functions/index");

// const STATUS = {
//   PENDING: "pending",
//   FAILED: "failed",
//   SUCCESS: "success",
// };
// console.log(STATUS.PENDING);
const _getEncryptedCardNo = (cardNo) => {
  const cardLength = parseInt(cardNo.length / 2);

  return (
    cardNo.substring(0, cardLength) +
    Array.from(Array(cardLength).keys())
      .map((n) => "*")
      .join("")
  );
};

const _validateSubscriptionData = (requestBody) => {
  const schema = {
    productId: Joi.string().required(),
    subscriptionPlan: Joi.string().required(),
  };
  return Joi.validate(requestBody, schema);
};

const _validateCardDetails = (requestBody) => {
  const schema = {
    cardNo: Joi.string().required(),
    expirationMonth: Joi.string().required(),
    expirationYear: Joi.string().required(),
    cvc: Joi.string().required(),
  };

  return Joi.validate(requestBody, schema);
};

const getProfile = async (req, res) => {
  const userDocument = await User.findById(req.user._id).select("-password");

  if (!userDocument) return res.status(404).send("User not found");

  const user = userDocument.toJSON();

  if (user && user.creditCard && user.creditCard.cardNo !== null) {
    user.isCreditCardSet = true;
  }

  const { cardAuthorization, ...rest } = user;

  res.send({
    ...rest,
  });
};

const updateProfile = async (req, res) => {
  const { error } = validateUserOnUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    addressline1,
    city,
    state,
  } = req.body;

  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      name: {
        firstName,
        lastName,
      },
      phoneNumber,
      address: {
        line1: addressline1,
        city,
        state,
      },
    }
  );
  res.send("Done");
};

const changePassword = async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);

  const { _id, email, name } = req.user;

  await User.findOneAndUpdate(
    { _id },
    {
      password: newPassword,
    }
  );

  await new Email().sendPasswordChangeNotification(email, name);

  res.send("Done");
};

const register = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    addressline1,
    city,
    state,
  } = req.body;

  let user = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (user)
    return res
      .status(400)
      .send("User with same email or phone number already registered.");

  user = new User({
    name: {
      firstName,
      lastName,
    },
    email,
    phoneNumber,
    password,
    address: {
      line1: addressline1,
      city,
      state,
    },
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "firstName", "email"]));
};

const _handleEmailNotification = async (
  user,
  product,
  { name: subscriptionName },
  billingDay
) => {
  const email = new Email();
  email.sendSubscriptionEmail(user, product, subscriptionName, billingDay);
  email.sendSubscriptionEmailToAdmin(user, product, subscriptionName);
};

const _handleBillingUser = async (req, res) => {
  const { data: response } = await transactionsServices.chargeUserCard(
    req.authorization_code,
    req.user.email,
    req.price
  );

  const { data } = response;
  winston.info(data);
  if (data.status !== "success")
    return res
      .status(403)
      .send("Unable to charge your card. Please retry or use another card");

  return data;
};

const _handleDailySubscription = async (
  req,
  res,
  newSubscriptionId,
  subscriptionDuration
) => {
  const transactionData = await _handleBillingUser(req, res); // bill user
  const { status, transaction_date, amount, authorization } = transactionData;
  const { _id: userId } = req.user;
  // populate transaction table
  const userInTransactionsCollection = await Transactions.findOne({ userId });
  if (!userInTransactionsCollection) {
    // add user to transaction collection
    const newTransaction = new Transactions({
      userId,
      subscriptions: [
        {
          subscriptionId: newSubscriptionId,
          transaction: {
            status: "pending",
            nextBillingDate: addDaysToDate(
              new Date(transaction_date),
              Number(subscriptionDuration)
            ),
            lastTransactionDate: transaction_date,
            history: [
              {
                amount: amount / 100,
                transactionDate: transaction_date,
                status,
                subscriptionDuration: {
                  from: new Date(),
                  to: addDaysToDate(new Date(), Number(subscriptionDuration)),
                },
                cardDetail: {
                  last4: authorization.last4,
                  brand: authorization.brand,
                },
              },
            ],
            retries: 0,
          },
        },
      ],
    });

    await newTransaction.save();
  } else {
    await userInTransactionsCollection.update({
      $addToSet: {
        subscriptions: {
          subscriptionId: newSubscriptionId,
          transaction: {
            status: "pending",
            nextBillingDate:
              status === "success"
                ? addDaysToDate(
                    new Date(transaction_date),
                    Number(subscriptionDuration)
                  )
                : new Date(),
            lastTransactionDate: transaction_date,
            history: [
              {
                amount: amount / 100,
                transactionDate: transaction_date,
                status,
                subscriptionDuration: {
                  from: new Date(),
                  to: addDaysToDate(new Date(), Number(subscriptionDuration)),
                },
                cardDetail: {
                  last4: authorization.last4,
                  brand: authorization.brand,
                },
              },
            ],
            retries: 0,
          },
        },
      },
    });
  }
};

const _handleWeeklyMonthlySubscription = async (
  req,
  res,
  newSubscriptionId,
  subscriptionPlanDuration,
  subscriptionPlanName,
  billingDay
) => {
  const { _id: userId } = req.user;
  const userInTransactionsCollection = await Transactions.findOne({ userId });

  if (!userInTransactionsCollection) {
    // create a user record in transaction
    // The value for billingDay is either dayOfTheWeek (0 - 6) for weekly subscription : actual Date (24-07-2020) of the month for monthly
    const newTransaction = new Transactions({
      userId,
      subscriptions: [
        {
          subscriptionId: newSubscriptionId,
          transaction: {
            status: "pending",
            nextBillingDate:
              subscriptionPlanName.toLowerCase() === "weekly"
                ? generateNextBillingDate(subscriptionPlanDuration, billingDay)
                : new Date(billingDay),
          },
        },
      ],
    });

    await newTransaction.save();
  } else {
    // user exists in collection
    await userInTransactionsCollection.update({
      $addToSet: {
        subscriptions: {
          subscriptionId: newSubscriptionId,
          transaction: {
            status: "pending",
            nextBillingDate:
              subscriptionPlanName.toLowerCase() === "weekly"
                ? generateNextBillingDate(subscriptionPlanDuration, billingDay)
                : new Date(billingDay),
          },
        },
      },
    });
  }
};

const _handleHourlySubscription = async (
  req,
  res,
  newSubscriptionId,
  subscriptionPlanDuration
) => {
  const transactionData = await _handleBillingUser(req, res); // bill user
  const { status, transaction_date, amount, authorization } = transactionData;
  const { _id: userId } = req.user;
  // populate transaction table
  const userInTransactionsCollection = await Transactions.findOne({ userId });
  if (!userInTransactionsCollection) {
    // add user to transaction collection
    const newTransaction = new Transactions({
      userId,
      subscriptions: [
        {
          subscriptionId: newSubscriptionId,
          transaction: {
            status: "pending",
            nextBillingDate: new Date(new Date().getTime() + 3600000),
            lastTransactionDate: transaction_date,
            history: [
              {
                amount: amount / 100,
                transactionDate: transaction_date,
                status,
                subscriptionDuration: {
                  from: new Date(),
                  to: new Date(new Date().getTime() + 3600000),
                },
                cardDetail: {
                  last4: authorization.last4,
                  brand: authorization.brand,
                },
              },
            ],
            retries: 0,
          },
        },
      ],
    });

    await newTransaction.save();
  } else {
    await userInTransactionsCollection.update({
      $addToSet: {
        subscriptions: {
          subscriptionId: newSubscriptionId,
          transaction: {
            status: "pending",
            nextBillingDate:
              status === "success"
                ? new Date(new Date().getTime() + 3600000)
                : new Date(),
            lastTransactionDate: transaction_date,
            history: [
              {
                amount: amount / 100,
                transactionDate: transaction_date,
                status,
                subscriptionDuration: {
                  from: new Date(),
                  to: new Date(new Date().getTime() + 3600000),
                },
                cardDetail: {
                  last4: authorization.last4,
                  brand: authorization.brand,
                },
              },
            ],
            retries: 0,
          },
        },
      },
    });
  }
};

const _getUserName = async (userId) => {
  return await User.findOne({ _id: userId }).select("name email");
};

const _handleUserSubscription = async (req, res, type = "new") => {
  const { _id: userId } = req.user;
  const { productId, subscriptionPlan, billingDay } = req.body;

  // get product detail
  const productInDb = await Product.findById({ _id: productId }).select(
    "price name"
  );
  req.price = productInDb.price; // add product price to request object

  const newSubscriptionId = new mongoose.Types.ObjectId().toHexString();

  // get subscription plan type
  const subscriptionPlanInDb = await SubscriptionPlan.findById({
    _id: subscriptionPlan,
  }).select("name duration");

  const {
    name: subscriptionPlanName,
    duration: subscriptionPlanDuration,
  } = subscriptionPlanInDb;

  if (subscriptionPlanName.toLowerCase() === "daily") {
    await _handleDailySubscription(
      req,
      res,
      newSubscriptionId,
      subscriptionPlanDuration
    );
  } else if (subscriptionPlanName.toLowerCase() === "hourly") {
    // handle hourly subscription
    await _handleHourlySubscription(
      req,
      res,
      newSubscriptionId,
      subscriptionPlanDuration
    );
  } else {
    await _handleWeeklyMonthlySubscription(
      req,
      res,
      newSubscriptionId,
      subscriptionPlanDuration,
      subscriptionPlanName,
      billingDay
    );
  }

  // Populate user's record in Subscriptions Collection to keep track of User's subscripitons
  if (type !== "new") {
    // we have user's record in subscription table
    await Subscription.findOneAndUpdate(
      {
        userId,
      },
      {
        $addToSet: {
          subscriptions: {
            _id: newSubscriptionId,
            subscriptionPlan,
            productId,
            billingDay,
            subscriptionDate: new Date(),
            createdDate: new Date(),
          },
        },
      }
    );

    const _preferredBillingDay =
      subscriptionPlanName.toLowerCase() === "weekly"
        ? getDayOfTheWeekFromNumber(Number(billingDay))
        : new Date(billingDay).toDateString();

    _handleEmailNotification(
      await _getUserName(userId),
      productInDb,
      subscriptionPlanInDb,
      _preferredBillingDay
    );
    return;
  }

  // user initial subscription
  const newSubscription = new Subscription({
    userId,
    subscriptions: {
      _id: newSubscriptionId,
      subscriptionPlan,
      productId,
      billingDay,
      subscriptionDate: new Date(),
      createdDate: new Date(),
    },
  });

  const userSubscriptions = await newSubscription.save();

  // update user document with subscriptions ID
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      subscriptions: userSubscriptions._id,
    }
  );
  _handleEmailNotification(
    await _getUserName(userId),
    productInDb,
    subscriptionPlanInDb
  );
  return;
};

const subscribeToProduct = async (req, res) => {
  const { email: userEmail, _id: userId } = req.user;
  const { productId, subscriptionPlan } = req.body;

  let { error } = _validateSubscriptionData({
    productId,
    subscriptionPlan,
  });
  if (error) return res.status(400).send(error.details[0].message);

  // check if user has filled card info
  const userInDb = await User.findById({ _id: userId }).select(
    "cardAuthorization"
  );

  if (userInDb.cardAuthorization == null)
    return res
      .status(403)
      .send("Card details not found. Please fill in your card details.");

  // add user authorizationCode to req object.
  req.authorization_code =
    userInDb.cardAuthorization.authorization.authorization_code;

  // populate subscription collection
  const userInSubscriptionCollection = await Subscription.findOne({ userId });
  if (!userInSubscriptionCollection) {
    await _handleUserSubscription(req, res);
    return res.send("Updated");
  }

  await _handleUserSubscription(req, res, "update");
  return res.send("Success");
};

const getSubscriptions = async (req, res) => {
  const result = await Subscription.findOne({
    userId: req.user._id,
  })
    .populate({
      path: "subscriptions.productId",
      model: "Product",
    })
    .populate({
      path: "subscriptions.subscriptionPlan",
      model: "SubscriptionPlan",
    });

  res.send((result && result.subscriptions) || []);
};

const unsubscribe = async (req, res) => {
  const { id } = req.params;

  const result = await Subscription.update(
    { userId: req.user._id },
    {
      $pull: {
        subscriptions: {
          _id: id,
        },
      },
    },
    { multi: true }
  );

  res.send(result);
};

const getCardStatus = async (req, res) => {
  const result = await User.findById({ _id: req.user._id }).select(
    "-_id creditCard"
  );

  const creditCard = result.toJSON().creditCard;
  if (!creditCard) return res.send(false);

  const isSet =
    Object.keys(creditCard).length > 0 && creditCard.cardNo ? true : false;
  res.send(isSet);
};

const addCreditCard = async (req, res) => {
  let { error } = _validateCardDetails(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { cardNo, expirationMonth, expirationYear, cvc } = req.body;

  await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      creditCard: {
        cardNo,
        expirationMonth,
        expirationYear,
        cvc,
      },
    }
  );

  res.send("Success");
};

module.exports = {
  getProfile,
  updateProfile,
  register,
  subscribeToProduct,
  getSubscriptions,
  unsubscribe,
  getCardStatus,
  addCreditCard,
  changePassword,
};
