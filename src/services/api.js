import axios from "axios";

const api = axios.create({
  baseURL: "http://172.29.220.74:3333",
});

export default api;
