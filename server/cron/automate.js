const Email = require("../services/email");
const subscriptions = require("../services/subscriptions");
const transactionsServices = require("../services/transactions");
const { Transactions } = require("../models/transactions");
const { addDaysToDate } = require("../functions/index");
const winston = require("winston");

const MAX_RETRIES = 3;
const HOURLY_SUB_MAX_RETRIES = 8;

const ONE_HOUR = 3600000;

const handleChargingCard = async ({ email, cardAuthorization }, price) => {
  const { authorization_code } = cardAuthorization.authorization;

  try {
    const { data: response } = await transactionsServices.chargeUserCard(
      authorization_code,
      email,
      price
    );

    const { data } = response;
    winston.info(data);
    return data;

    // Mock response
    // return {
    //   status: "success",
    //   transaction_date: new Date(),
    //   amount: 270000,
    //   authorization: {
    //     last4: "4081",
    //     brand: "visa",
    //   },
    // };
  } catch (e) {
    console.log(e);
    winston.log(e);
  }
};

const getNextBillingDate = (
  status,
  transaction_date,
  subscriptionPlan,
  nextBillingDate
) => {
  if (status === "success") {
    if (subscriptionPlan.name.toLowerCase() === "hourly") {
      return new Date(new Date().getTime() + ONE_HOUR);
    }
    return addDaysToDate(
      new Date(transaction_date),
      Number(subscriptionPlan.duration)
    );
  }

  if (subscriptionPlan.name.toLowerCase() === "hourly") {
    return new Date(new Date(transaction_date).getTime() + ONE_HOUR);
  }

  return addDaysToDate(nextBillingDate, 1); // 24hrs
};

const handleTransaction = async (
  user,
  product,
  historyInDB,
  subscriptionPlan,
  userSubscriptionId,
  nextBillingDate,
  retries,
  isTransactionRetry = false
) => {
  const {
    status,
    transaction_date,
    amount,
    authorization,
  } = await handleChargingCard(user, product.price);

  if (status !== "success") {
    await email.sendBillingErrorMail(user, subscriptionPlan.name);
    console.log("Error billing card");
    winston.info("Error billing card");
  }

  await Transactions.updateOne(
    {
      "subscriptions.subscriptionId": userSubscriptionId,
    },
    {
      $set: {
        "subscriptions.$.transaction": {
          status: status === "success" ? "pending" : "failed",
          nextBillingDate: getNextBillingDate(
            status,
            transaction_date,
            subscriptionPlan,
            nextBillingDate
          ),
          lastTransactionDate: transaction_date,
          history: [
            {
              amount: amount / 100,
              transactionDate: transaction_date,
              status,
              subscriptionDuration: {
                from: new Date(),
                to: addDaysToDate(
                  new Date(),
                  Number(subscriptionPlan.duration)
                ),
              },
              cardDetail: {
                last4: authorization.last4,
                brand: authorization.brand,
              },
            },
            ...historyInDB,
          ],
          retries: isTransactionRetry && status !== "success" ? retries + 1 : 0,
        },
      },
    }
  );

  // send mail to user on successful subscription
  if (status === "success") {
    await email.sendSubscriptionEmail(user, product, subscriptionPlan.name);
    console.log("Send user subscription success email");
    winston.info("Send user subscription success email");
  }
};

const email = new Email();

const execute = async () => {
  // loop through db to determine which user account should be debited
  winston.info("Executing Cron Job running");
  const subscriptionsInDb = await subscriptions.fetchAllUsersWithSubscriptionsForCronJob();

  subscriptionsInDb.forEach(({ subscriptions, userId: user }) => {
    subscriptions.forEach(
      async ({
        subscriptionPlan,
        _id: userSubscriptionId,
        productId: product,
      }) => {
        const userInTransactionCollection = await Transactions.findOne({
          userId: user._id,
        });

        if (!userInTransactionCollection) return;

        const subscriptionIndexInTransCollection = userInTransactionCollection.subscriptions.find(
          (subs) => subs.subscriptionId === userSubscriptionId
        );
        if (!subscriptionIndexInTransCollection) return;

        const { transaction } = subscriptionIndexInTransCollection;
        const { nextBillingDate, status, retries } = transaction;
        let { history: historyInDB } = transaction;

        if (!historyInDB) historyInDB = [];

        const today = new Date();

        if (
          (today.getDate() === nextBillingDate.getDate() ||
            today.getTime() > nextBillingDate.getTime()) &&
          status === "pending"
        ) {
          winston.info(
            user.name.firstName +
              " " +
              user.name.lastName +
              ": " +
              subscriptionPlan.name +
              " Billing Date: " +
              nextBillingDate.toDateString()
          );
          await handleTransaction(
            user,
            product,
            historyInDB,
            subscriptionPlan,
            userSubscriptionId,
            nextBillingDate,
            retries
          );
        }

        // retry billing
        if (
          today.getDate() === nextBillingDate.getDate() &&
          status === "failed"
        ) {
          if (
            retries < MAX_RETRIES ||
            (subscriptionPlan.name.toLowerCase() === "hourly" &&
              retries < HOURLY_SUB_MAX_RETRIES)
          )
            await handleTransaction(
              user,
              product,
              historyInDB,
              subscriptionPlan,
              userSubscriptionId,
              nextBillingDate,
              retries,
              true
            );
          // TO-DO
          // unsubscribe user as a result of multiple failed attempt on billing card
          // and send email to that effect
        }

        // send reminder email to customers
        const dayDifference = nextBillingDate.getDate() - today.getDate();

        if (
          subscriptionPlan.name.toLowerCase() === "weekly" &&
          dayDifference === 3
        ) {
          // send email of renewal
          await email.sendRenewalReminder(
            user,
            product,
            subscriptionPlan.name,
            dayDifference
          );
        }
        if (
          subscriptionPlan.name.toLowerCase() === "monthly" &&
          (dayDifference === 7 || dayDifference === 3)
        ) {
          // send email of renewal
          await email.sendRenewalReminder(
            user,
            product,
            subscriptionPlan.name,
            dayDifference
          );
        }
      }
    );
  });
};

module.exports = {
  execute,
};
