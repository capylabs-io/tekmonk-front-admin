import tekdojoAxios from "./axios.config";

const baseRoute = "/mission-histories";

export const ReqCreateMissionHistory = async (data: any) => {
  const response = await tekdojoAxios.post(`${baseRoute}`, data);
  return response.data;
};
