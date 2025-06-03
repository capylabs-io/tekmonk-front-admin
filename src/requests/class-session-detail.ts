import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { ClassSessionDetail } from "@/types/common-types";

export const ReqGetClassSessionDetail = async (query: string = "") => {
  const response = await tekdojoAxios.get(
    `${BASE_URL}/class-session-student-details?${query}`
  );
  return response.data as StrapiResponse<ClassSessionDetail[]>;
};
export const ReqCreateClassSessionDetail = async (data: any) => {
  const response = await tekdojoAxios.post(
    `${BASE_URL}/class-session-student-details`,
    { data }
  );
  return response.data as StrapiResponse<ClassSessionDetail[]>;
};
