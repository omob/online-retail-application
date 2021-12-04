import http from "./httpService";
import JwtDecode from "jwt-decode";
import { apiUrl } from "../config.json";

const apiEndPoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getToken());

export async function login(email, password) {
  const { data: jwt } = await http.post(`${apiEndPoint}`, {
    email,
    password,
  });
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getCurrentUser() {
  isTokenExpired();
  try {
    const jwt = localStorage.getItem(tokenKey);
    return JwtDecode(jwt);
  } catch (error) {}
}

export function setToken(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

const isTokenExpired = () => {
  if (!getToken()) return;

  if (JwtDecode(getToken()).exp < Date.now() / 1000) {
    logout();
    return true;
  }

  return false;
};
isTokenExpired();

export default {
  login,
  logout,
  loginWithJwt,
  getCurrentUser,
  getToken,
  isTokenExpired,
  setToken,
};
