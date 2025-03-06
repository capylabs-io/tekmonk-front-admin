// http://localhost:1337/api/custom-auth/users?filters[user_role][code][$eq]=STUDENT&populate=user_role&page=1&pageSize=10

import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { EnRollment } from "@/types/common-types";

export const ReqGetEnrollments = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/enrollments?${query}`);
  return response.data as StrapiResponse<EnRollment[]>;
};

export const ReqCreateEnrollment = async (data: any) => {
  const response = await tekdojoAxios.post(
    `${BASE_URL}/enrollments/custom-create/`,
    data
  );
  return response.data;
};

export const ReqDeleteEnrollment = async (id: number) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/enrollments/${id}`);
  return response.data;
};
