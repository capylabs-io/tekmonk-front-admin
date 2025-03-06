// http://localhost:1337/api/custom-auth/users?filters[user_role][code][$eq]=STUDENT&populate=user_role&page=1&pageSize=10

import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { ClassSession } from "@/types/common-types";

//GET METHOD
export const ReqGetClassSessions = async (query: string = "") => {
  const response = await tekdojoAxios.get(
    `${BASE_URL}/class-sessions?${query}`
  );
  return response.data as StrapiResponse<ClassSession[]>;
};

//POST METHOD
export const ReqCreateClassSession = async (data: any) => {
  const res = await tekdojoAxios.post(
    `${BASE_URL}/class-sessions/custom-create`,
    data
  );
  return res.data;
};

//PUT METHOD
export const ReqUpdateClassSession = async (id: string, data: any) => {
  const res = await tekdojoAxios.put(`${BASE_URL}/class-sessions/${id}`, data);
  return res.data;
};
