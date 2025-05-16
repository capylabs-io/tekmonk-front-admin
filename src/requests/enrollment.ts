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

export const ReqUpdateEnrollment = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(
    `${BASE_URL}/enrollments/${id}`,
    data
  );
  return response.data;
};

export const ReqDeleteEnrollment = async (id: number) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/enrollments/${id}`);
  return response.data;
};
