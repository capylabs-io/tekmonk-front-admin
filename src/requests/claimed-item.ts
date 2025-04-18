import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { ClaimedItem } from "@/types/shop";

export const ReqGetClaimedItem = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/claimed-items?${query}`);
  return response.data as StrapiResponse<ClaimedItem[]>;
};

export const ReqUpdateClaimedItem = async (id: string, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/claimed-items/${id}`, {
    data,
  });
  return response.data;
};
