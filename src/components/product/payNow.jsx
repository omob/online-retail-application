import React from "react";
import { PaystackButton } from "react-paystack";
import config from "../../config.json";
import authService from "../../services/authService";

const PayNow = ({ amount, text, className, onPaymentSuccess }) => {
  const referenceId = new Date().getTime();

  const API_CONFIG = {
    reference: referenceId,
    email: authService.getCurrentUser()?.email,
    amount: amount * 100,
    publicKey: config.PAYSTACK_PUBLIC_KEY,
  };

  const componentProps = {
    ...API_CONFIG,
    className: className || "btn btn-sm btn-danger font-small",
    text: text || "Pay Now",
    onSuccess: onPaymentSuccess,
    onClose: () => null,
  };

  return <PaystackButton {...componentProps} />;
};

export default PayNow;
