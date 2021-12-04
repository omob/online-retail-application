import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndPoint = apiUrl + "/products";

const getProducts = async () => {
  return http.get(`${apiEndPoint}`);
};

const getProduct = async (id) => {
  return http.get(`${apiEndPoint}/${id}`);
};

const saveProduct = async (product, id) => {
  if (!id) return http.post(`${apiEndPoint}`, product);

  return http.put(`${apiEndPoint}/${id}`, product);
};

const removeProduct = (id) => {
  return http.delete(`${apiEndPoint}/${id}`);
};

export default {
  getProducts,
  saveProduct,
  getProduct,
  removeProduct,
};
