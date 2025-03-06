// http://localhost:1337/api/custom-auth/users?filters[user_role][code][$eq]=STUDENT&populate=user_role&page=1&pageSize=10

import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { Class } from "@/types/common-types";

export const ReqGetClasses = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/classes?${query}`);
  return response.data as StrapiResponse<Class[]>;
};

export const ReqCreateClass = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/classes`, data);
  return response.data;
};

export const ReqDeleteClass = async (id: number) => {
  return await tekdojoAxios.delete(`${BASE_URL}/classes/${id}`);
};

export const ReqUpdateClass = async (id: string, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/classes/${id}`, data);
  return response.data;
};
