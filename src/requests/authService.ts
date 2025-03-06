import { BASE_URL } from "@/contants/api-url";
import axios from "axios";

export const getNewToken = async (refreshToken: string) => {
  return axios.post(`${BASE_URL}/token/refresh`, {
    refreshToken: refreshToken,
  });
};
