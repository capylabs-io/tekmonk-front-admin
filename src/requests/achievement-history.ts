import tekdojoAxios from "./axios.config";

export const ReqCreateAchievementHistory = async (data: any) => {
  return await tekdojoAxios.post("/achievement-histories", data);
};
