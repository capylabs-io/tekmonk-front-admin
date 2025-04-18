import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { UserRole } from "@/types/common-types";

export const ReqGetUserRoles = async () => {
  const response = await tekdojoAxios.get(`${BASE_URL}/user-roles`);
  return response.data as StrapiResponse<UserRole[]>;
};
