const nodemailer = require("nodemailer");
const config = require("config");
const winston = require("winston");
const subscription = require("../models/subscription");
const { formatNumberWithComma } = require("../functions");

// host: "Retail Appglobal.com",

module.exports = class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      port: 587,
      host: config.email.host,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(subject, message, email) {
    const info = await this.transporter.sendMail({
      from: `"Retail App Global " <${config.email.user}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${subject}`, // Subject line
      html: `${message}`, // html body
    });
    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  sendBillingErrorMail = async (
    { name, email, cardAuthorization },
    subscriptionPlanType
  ) => {
    const message = `
     <h3>Hi ${name.firstName} </h3>
     
     <p>There was an error billing your card- ${
       cardAuthorization.authorization.card_type
     } (**** ${
      cardAuthorization.authorization.last4
    }). We will retry billing in ${
      subscriptionPlanType.toLowerCase() === "hourly" ? "1hr" : "24hrs"
    }, kindly endeavour you have enough credit facility in the account.</p>

     <p>
     Regards <br>
     <b>Retail App Billing Team</b>
     </p>
    `;
    try {
      await this.sendMail("Billing Error", message, email);
      winston.info(
        `Email on Error billing ${name.firstName} ${name.lastName} card sent`
      );
    } catch (error) {
      winston.error("Error received: ", error);
    }
  };

  sendSubscriptionEmail = async (
    { name, email },
    { price: productPrice, name: productName },
    subscriptionPlan,
    billingDay = "",
    renewal = false
  ) => {
    let billingD = "";

    const message = `
     <h3>Hi ${name.firstName} </h3>
     
     <p>
     Thank you for your subscription.<br>
     You have successfully ${
       renewal ? "renewed your " : "subscribed to a"
     } <b>${subscriptionPlan}</b> subscription of <b>${productName}</b> at &#x20a6;${formatNumberWithComma(
      productPrice
    )}. 
     </p>
     ${
       billingDay &&
       "You will be billed on " +
         `${
           subscriptionPlan.toLowerCase() == "hourly"
             ? "Every Hour"
             : subscriptionPlan.toLowerCase() == "daily"
             ? "each day (Everyday)"
             : billingDay
         }.`
     }
    <p> Regards </p>
     <b>Retail App Billing Team</b>
    `;
    try {
      await this.sendMail("New Subscription Order", message, email);
      winston.info(
        `Email on New Subscription order for ${name.firstName} ${name.lastName} sent`
      );
    } catch (error) {
      winston.error("Error received: ", error);
    }
  };

  sendSubscriptionEmailToAdmin = async (
    { name, email },
    { price: productPrice, name: productName },
    subscriptionPlan
  ) => {
    const message = `
     <h3>Dear Admin </h3>
     
     <p>A new user has subscribed to a product. </p>
    
     <table style="text-align:left">
      <tbody>
        <tr> 
          <th>Name:</th> 
          <td>${" "}${name.firstName} ${name.lastName} </td> 
        </tr>
        <tr>
          <th>Product:</th>
          <td>${" "}${productName}</td> 
        </tr>  
        <tr>
          <th>Price:</th>
          <td>${" "}&#x20a6;${formatNumberWithComma(productPrice)}</td> 
        </tr>  
        <tr>
          <th>Plan:</th>
          <td>${" "}${subscriptionPlan}</td> 
        </tr>  
      </tbody>
     </table>
      
    <p> Regards </p>
     <b>Retail App Billing Team</b>
    `;
    try {
      await this.sendMail(
        "New Subscription Order",
        message,
        config.get("adminEmail")
      );
      winston.info(
        `SEND EMAIL TO ADMIN ON NEW SUBSCRIPTION ORDER ${name.firstName} ${name.lastName}`
      );
    } catch (error) {
      winston.error("ERROR SENDING EMAIL ", error);
    }
  };

  sendRenewalReminder = async (
    { name, email },
    { price: productPrice, name: productName },
    subscriptionPlan,
    remainingDays
  ) => {
    const message = `
     <h3>Hi ${name.firstName} </h3>
     
     <p>
     Please be informed your subscription to <b>${productName}</b> will be renewed in ${remainingDays} day${
      remainingDays > 1 ? "s" : ""
    }.</p>
     <p>Ensure you have enough funds in your account to keep your subscription active. </p>
    
    <p> Regards </p>
     <b>Retail App Billing Team</b>
    `;
    try {
      await this.sendMail("Subscription Reminder", message, email);
      winston.info(
        `Send reminder to ${name.firstName} ${name.lastName} on subscription payment date`
      );
    } catch (error) {
      winston.error("Error received: ", error);
    }
  };

  sendPasswordChangeNotification = async (email, name) => {
    const message = `
    <h3>Hi ${name.firstName} </h3>
    <p>Your password has been changed successfully. </p>
    <span>
      If you did not initiate this change, kindly reset your password immediately or contact our support for assistance.
    </span>

    <p> Regards </p>
    <b>Retail App Team </b>

    `;

    try {
      await this.sendMail("Password Reset", message, email);
      winston.info(`Password Changed by ${name.firstName} ${name.lastName}`);
    } catch (error) {
      winston.error("Error received: ", error);
    }
  };

  sendOneOffPaymentEmail = async (
    { name, email },
    { price: productPrice, name: productName },
    referenceId
  ) => {
    const userMessage = `
     <h3>Hi ${name.firstName} </h3>
     
     <p>
      We have received your order for <b>${productName}</b> and payment of &#x20a6;${formatNumberWithComma(
      productPrice
    )}</p>
     <p>ReferenceId: ${referenceId} </p>
     <br>
     <p> Regards </p>
     <b>Retail App Billing Team</b>
    `;

    const adminMessage = `
     <h3>Hi Admin </h3>
      <p>
        We have received a <b>One-Off Payment</b> of &#x20a6;${formatNumberWithComma(
          productPrice
        )} for the order of <b>${productName}</b> from <b>${name.firstName} ${
      name.lastName
    } </b>.

      </p>
       <p>ReferenceId: ${referenceId} </p>
     <br>
     <p> Regards </p>
     <b>Retail App Billing Team</b>
    `;
    try {
      await this.sendMail("One-off Payment Receipt", userMessage, email); // to user
      await this.sendMail(
        "New One-off Payment",
        adminMessage,
        config.get("adminEmail")
      ); // to admin

      winston.info(
        `Email on One off payment order: ${name.firstName} ${name.lastName} sent`
      );
    } catch (error) {
      winston.error("Error received: ", error);
    }
  };
};
