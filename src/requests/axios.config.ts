import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useUserStore } from "@/store/UserStore";

const BASE_URL = "http://localhost:1337/api";

const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
};

const tekdojoAxios = axios.create(config);

const getJwt = async () => {
  const jwt = useUserStore.getState().jwt;
  return jwt;
};

tekdojoAxios.interceptors.request.use(
  async (config) => {
    const jwt = await getJwt();
    if (jwt) {
      // config.headers không đc gán trực tiếp mà phải thông qua phương thức set của đối tượng AxiosRequestConfig
      config.headers.set("Authorization", `Bearer ${jwt}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default tekdojoAxios;
