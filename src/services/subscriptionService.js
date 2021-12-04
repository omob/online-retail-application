import http from "./httpService";
import { apiUrl } from "../config.json";
const apiEndPoint = apiUrl + "/subscriptions";

const getSubscriptionPlans = () => {
  return http.get(`${apiEndPoint}/plans`);
};

const getSubscriptions = () => {
  return http.get(`${apiEndPoint}`);
};

const getUserSubscriptions = (subscriptionId) => {
  return http.get(`${apiEndPoint}/${subscriptionId}`);
};

export default {
  getSubscriptionPlans,
  getSubscriptions,
  getUserSubscriptions,
};
