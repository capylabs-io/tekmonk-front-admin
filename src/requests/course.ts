// http://localhost:1337/api/custom-auth/users?filters[user_role][code][$eq]=STUDENT&populate=user_role&page=1&pageSize=10

import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { Course } from "@/types/common-types";

export const ReqGetCourses = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/courses?${query}`);
  return response.data as StrapiResponse<Course[]>;
};

export const ReqCreateCourse = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/courses`, {
    data: data,
  });
  return response.data;
};

export const ReqUpdateCourse = async (id: string, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/courses/${id}`, {
    data,
  });
  return response.data;
};

export const ReqDeleteCourse = async (id: string) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/courses/${id}`);
  return response.data;
};
