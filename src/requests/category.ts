import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { Category } from "@/types/Category";

export const ReqGetCategory = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/categories?${query}`);
  return response.data as StrapiResponse<Category[]>;
};

export const ReqCreateCategory = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/categories`, { data });
  return response.data as StrapiResponse<Category>;
};

export const ReqUpdateCategory = async (id: string, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/categories/${id}`, {
    data,
  });
  return response.data as StrapiResponse<Category>;
};

export const ReqDeleteCategory = async (id: string) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/categories/${id}`);
  return response.data as StrapiResponse<Category>;
};
