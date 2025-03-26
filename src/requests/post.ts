import { PostType } from "@/types";
import tekdojoAxios from "./axios.config";
import { BASE_URL } from "@/contants/api-url";
import { AxiosResponse } from 'axios'
import { StrapiResponse } from "./strapi-response-pattern";

const fakeData = [
  {
    id: 1,
    content: "Hello",
    media: "https://www.google.com",
    postedBy: 1,
    type: "image",
    metadata: "metadata",
  },
];

//for get all post (pagination)
export const getPostsPagination = async (page: number, limit: number) => {
  const response = await tekdojoAxios.get(
    `${BASE_URL}/posts?page=${page}&limit=${limit}`
  ); // fix later
  return response.data;
};
export const getListPost = async (query?: any) => {
  try {
    const res = await tekdojoAxios.get(`/posts?${query}`);
    return res.data as StrapiResponse<PostType[]>;
  } catch (error) {
    console.log("Error: ", error);
    return Promise.reject(error);
  }

};
export const getListPostCustom = async (query?: any) => {
  try {
    const res = await tekdojoAxios.get(`/get-custom-list-posts?${query}`);
    return res.data;
  } catch (error) {
    console.log("Error: ", error);
    return Promise.reject(error);
  }

};

export const uploadPost = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/posts`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const findPost = async (id: number) => {
  const response = await tekdojoAxios.get(`${BASE_URL}/posts/${id}`);
  return response.data;
};
export const updatePost = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/posts/${id}`, { data });
  return response.data;
};

export const likePost = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/likes`, data);
  return response.data;
};

