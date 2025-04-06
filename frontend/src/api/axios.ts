import axios from "axios";

const BASE_URL = "http://3.78.187.71:8080";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
