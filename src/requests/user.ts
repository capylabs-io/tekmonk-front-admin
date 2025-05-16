import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { User } from "@/types/common-types";

export const ReqGetUsers = async (query: string = "") => {
  const response = await tekdojoAxios.get(
    `${BASE_URL}/custom-auth/users?${query}`
  );
  return response.data as StrapiResponse<User[]>;
};

export const ReqUpdateUser = async (id: string, data: any) => {
  const res = await tekdojoAxios.put(`${BASE_URL}/users/${id}`, data);
  return res.data;
};

export const ReqDeleteUser = async (id: string) => {
  return await tekdojoAxios.delete(`${BASE_URL}/users/${id}`);
};

export const ReqGetClassUserRemainingInClass = async (query: string = "") => {
  return (await tekdojoAxios.get(
    `${BASE_URL}/custom-auth/remaining-users-in-class?${query}`
  )) as StrapiResponse<User[]>;
};

export const ReqGetUserHaveNotAchievedMission = async (query: string = "") => {
  const response = await tekdojoAxios.get(
    `/custom-user/users-have-not-achieve-mission?${query}`
  );
  return response.data as StrapiResponse<User[]>;
};

export const ReqGetUserHaveNotInClass = async (query: string = "") => {
  const response = await tekdojoAxios.get(
    `/custom-auth/users-have-not-in-class?${query}`
  );
  return response.data as StrapiResponse<User[]>;
};

export const ReqGetUserHaveAchievedAchievement = async (query: string = "") => {
  const response = await tekdojoAxios.get(
    `/custom-user/users-have-not-achieve-achievement?${query}`
  );
  return response.data as StrapiResponse<User[]>;
};

export const ReqGetUsersAchievedMission = async (query: string = "") => {
  const response = await tekdojoAxios.get(`/mission-histories?${query}`);
  return response.data as StrapiResponse<any[]>;
};
