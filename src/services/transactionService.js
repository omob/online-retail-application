import config, { apiUrl } from "../config.json";
import http from "./httpService";
const apiEndPoint = apiUrl + "/transactions";

const verify = (referenceId) => {
  return http.get("https://api.paystack.co/transaction/verify/" + referenceId, {
    headers: {
      Authorization: "Bearer " + config.PAYSTACK_PUBLIC_KEY,
    },
  });
};

const verifyTransaction = (referenceId) => {
  return http.get(`${apiEndPoint}/verify/${referenceId}`);
};

const purchasedProduct = (referenceId, product) => {
  return http.post(`${apiEndPoint}/oneoff`, {
    referenceId,
    product,
  });
};

export default {
  verify,
  verifyTransaction,
  purchasedProduct,
};
