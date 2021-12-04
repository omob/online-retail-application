import http from "./httpService";
import { apiUrl } from "../config.json";
import authService from "./authService";

const apiEndPoint = apiUrl + "/users";

const registerUser = async (user) => {
  if (user.role) {
    return await http.post(`${apiEndPoint}/register`, { ...user });
  }
  const { headers } = await http.post(`${apiEndPoint}`, { ...user });
  authService.loginWithJwt(headers["x-auth-token"]);
};

const subscribeToProduct = async (data) => {
  return http.post(`${apiEndPoint}/subscriptions`, data);
};

const getCreditCardStatus = async (data) => {
  return http.get(`${apiEndPoint}/cardstatus`);
};

const addCreditCardDetails = async (data) => {
  return http.post(`${apiEndPoint}/creditcard`, data);
};

const getSubscriptions = async () => {
  return http.get(`${apiEndPoint}/subscriptions`);
};

const unsubscribe = async (subscriptionId) => {
  return http.delete(`${apiEndPoint}/subscriptions/${subscriptionId}`);
};

const getProfile = async () => {
  return http.get(`${apiEndPoint}/me`);
};

const updateProfile = async (profile) => {
  return http.put(`${apiEndPoint}/me`, profile);
};

const changePassword = (password) => {
  return http.put(`${apiEndPoint}/me/change-password`, {
    password,
  });
};

const getUserProfile = async (profileId) => {
  return http.get(`${apiEndPoint}/${profileId}`);
};

const revokeUserAccess = (data) => {
  return http.put(`${apiEndPoint}/revoke`, data);
};

const getAllUsers = () => {
  return http.get(`${apiEndPoint}`);
};

const getRoles = () => {
  return http.get(`${apiEndPoint}/roles`);
};

const deleteUser = (userId) => {
  return http.delete(`${apiEndPoint}/${userId}`);
};

export default {
  registerUser,
  subscribeToProduct,
  getCreditCardStatus,
  getSubscriptions,
  unsubscribe,
  getProfile,
  addCreditCardDetails,
  updateProfile,
  getUserProfile,
  revokeUserAccess,
  getAllUsers,
  getRoles,
  deleteUser,
  changePassword,
};
