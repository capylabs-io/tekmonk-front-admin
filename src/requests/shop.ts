import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { ShopItem } from "@/types/shop";

export const ReqGetShopItem = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/shop-items?${query}`);
  return response.data as StrapiResponse<ShopItem[]>;
};

export const ReqCreateShopItem = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/shop-items`, {
    data: data,
  });
  return response.data;
};

export const ReqUpdateShopItem = async (id: string, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/shop-items/${id}`, {
    data,
  });
  return response.data;
};

export const ReqDeleteShopItem = async (id: string) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/shop-items/${id}`);
  return response.data;
};
