import { MissionHistory } from "@/types/mission";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";

const baseRoute = "/mission-histories";

export const ReqCreateMissionHistory = async (data: any) => {
  const response = await tekdojoAxios.post(`${baseRoute}`, data);
  return response.data;
};

export const ReqGetMissionHistory = async (query: string = "") => {
  const response = await tekdojoAxios.get<StrapiResponse<MissionHistory[]>>(
    `${baseRoute}?${query}`
  );
  return response.data;
};
