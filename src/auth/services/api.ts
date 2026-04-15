import axios from "axios";
import { getUser } from "../auth.storage";
export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_LOGIN,
});

Api.interceptors.request.use((config) => {
  const user = getUser();

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});