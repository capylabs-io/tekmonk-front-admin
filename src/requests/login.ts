import tekdojoAxios from "./axios.config";
import { BASE_URL } from "@/contants/api-url";
// set up axios interceptor
export const postLogin = async (body: any) => {
  const response = await tekdojoAxios.post(
    `${BASE_URL}/custom-auth/login`,
    body
  );
  return response.data;
};
export const ReqRegister = async (body: any) => {
  const response = await tekdojoAxios.post(
    `${BASE_URL}/custom-auth/register`,
    body
  );
  return response.data;
};
export const getMe = async () => {
  const response = await tekdojoAxios.get(`${BASE_URL}/users/me`);
  return response.data;
};
