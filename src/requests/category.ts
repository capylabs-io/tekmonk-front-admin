import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { Category } from "@/types/Category";

export const ReqGetCategory = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/categories?${query}`);
  return response.data as StrapiResponse<Category[]>;
};

