// http://localhost:1337/api/custom-auth/users?filters[user_role][code][$eq]=STUDENT&populate=user_role&page=1&pageSize=10

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
