import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";

export const ReqCreateAchievementHistory = async (data: any) => {
  return await tekdojoAxios.post("/achievement-histories", data);
};

export const ReqGetAchievementHistory = async (query: string = "") => {
  const response = await tekdojoAxios.get<StrapiResponse<any[]>>(
    `/achievement-histories?${query}`
  );
  return response.data;
};
