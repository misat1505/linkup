import { API_URL } from "../constants";
import axios from "axios";

export const AUTH_API = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});
