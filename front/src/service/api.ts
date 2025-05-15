import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

api.interceptors.request.use((config: any) => {
  config.headers['authorization'] = sessionStorage.getItem('lancesnow-token');

  return config;
}, (error) => {
  return Promise.reject(error);
});
