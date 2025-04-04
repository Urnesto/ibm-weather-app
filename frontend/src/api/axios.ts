import axios from "axios";

const BASE_URL = "http://35.228.72.62:8080/";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
