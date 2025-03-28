import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { Mission } from "@/types/mission";

export const postMission = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/missions`, data);
  return response.data;
};

export const findMission = async (id: number) => {
  const response = await tekdojoAxios.get(`${BASE_URL}/missions/${id}`);
  return response.data;
};

export const getMission = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/missions?${query}`);
  return response.data as StrapiResponse<Mission[]>;
};
export const updateMission = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/missions/${id}`, {
    data,
  });
  return response.data;
};
