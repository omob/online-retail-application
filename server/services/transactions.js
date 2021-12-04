const axios = require("axios");
const config = require("config");
const winston = require("winston");

const { User } = require("../models/user");
const Email = require("./email");
const { Transactions } = require("../models/transactions");
const paystackAPIURL = "https://api.paystack.co/transaction";

const verifyTransaction = async (req, res) => {
  const { id: referenceId } = req.params;

  // make request to paystack
  try {
    const { data: response } = await axios.get(
      `${paystackAPIURL}/verify/${referenceId}`,
      {
        headers: {
          Authorization: "Bearer " + config.get("PAYSTACK_SECRET_KEY"),
        },
      }
    );
    const { status, authorization, customer, amount } = response.data;

    if (status !== "success") res.send({ status: false });

    const user = await User.findOne({ email: customer.email });

    user.cardAuthorization = {
      authorization,
      email: customer.email,
    };

    user.creditCard = {
      cardNo: "**** **** **** " + authorization.last4,
      brand: authorization.brand,
      bank: authorization.bank,
    };

    await user.save();
    res.send(response.data);
  } catch (error) {
    winston.error("PAYSTACK VERIFICATION ERROR: ", error);
    res.status(400).send(false);
  }
};

const chargeUserCard = async (authorization_code, email, amount) => {
  return await axios.post(
    `${paystackAPIURL}/charge_authorization`,
    { authorization_code, email, amount: amount * 100 },
    {
      headers: {
        Authorization: "Bearer " + config.get("PAYSTACK_SECRET_KEY"),
      },
    }
  );
};

const oneoffpayment = async (req, res) => {
  const { name, email, _id } = req.user;

  const { referenceId, product } = req.body;

  const { price, name: productName } = product;

  await Transactions.findOneAndUpdate(
    { userId: _id },
    {
      $addToSet: {
        oneoffs: {
          referenceId,
          product: {
            price,
            name: productName,
          },
          transactionDate: new Date(),
        },
      },
    }
  );
  // send email to user and admin on payment
  await new Email().sendOneOffPaymentEmail(
    { name, email },
    product,
    referenceId
  );

  // update user transaction record to include a one off payment

  res.send("success");
};

module.exports = {
  verifyTransaction,
  chargeUserCard,
  oneoffpayment,
};
