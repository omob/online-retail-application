const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const transactionsSchema = new Schema({
  userId: Schema.Types.ObjectId,
  subscriptions: {
    type: Array,
    subscriptionId: Schema.Types.ObjectId,
    transactions: {
      type: Object,
      status: String,
      nextBillingDate: Date,
      lastTransactionDate: Date,
      retries: Number,
      history: {
        type: Array,
        amount: String,
        transactionDate: Date,
        status: String,
        subscriptionDuration: {
          from: Date,
          to: Date,
        },
        cardDetail: {
          last4: String,
          brand: String,
        },
      },
    },
  },
  oneoffs: {
    type: Array,
    referenceId: String,
    product: Object,
    transactionDate: Date,
  },
});

const Transactions = mongoose.model("Transactions", transactionsSchema);

module.exports = { Transactions };
