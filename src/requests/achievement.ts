import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { TAchievement } from "@/types/achievement";

export const ReqGetAllAchievement = async (query: string = "") => {
  const response = await tekdojoAxios.get(`/achievements?${query}`);
  return response.data as StrapiResponse<TAchievement[]>;
};

export const ReqCreateAchievement = async (data: any) => {
  const response = await tekdojoAxios.post(`/achievements`, data);
  return response.data;
};

export const ReqUpdateAchievement = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(`/achievements/${id}`, data);
  return response.data;
};
