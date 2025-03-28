import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { TAchievement } from "@/types/achievement";

export const ReqGetAllAchievement = async (query: string = "") => {
  const response = await tekdojoAxios.get(`/achievements?${query}`);
  return response.data as StrapiResponse<TAchievement[]>;
};
