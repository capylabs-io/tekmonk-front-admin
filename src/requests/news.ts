import { TNews } from "@/types/common-types";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";

//GET METHODS
export const ReqGetAllNews = async (query: string) => {
  try {
    const res = await tekdojoAxios.get(`/news?${query}`);
    return res.data as StrapiResponse<TNews[]>;
  } catch (error) {
    console.log("Error: ", error);
    return Promise.reject(error);
  }
};

export const ReqGetRamdomNews = async (type: string) => {
  try {
    const res = await tekdojoAxios.get(`/news/random-news?type=${type}`);
    return res.data as StrapiResponse<TNews[]>;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const ReqGetNewsById = async (id: string) => {
  try {
    const res = await tekdojoAxios.get(`/news/${id}`);
    return res.data as StrapiResponse<TNews>;
  } catch (error) {
    return Promise.reject(error);
  }
};

//POST METHODS
export const ReqCreateNews = async (data: any) => {
  try {
    const res = await tekdojoAxios.post("/news", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data as StrapiResponse<TNews>;
  } catch (error) {
    console.log("Error creating news: ", error);
    return Promise.reject(error);
  }
};

//PUT METHODS
export const ReqUpdateNews = async (id: string, data: any) => {
  console.log("data", data);
  try {
    const res = await tekdojoAxios.put(
      `/news/${id}`,
      { data: data },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data as StrapiResponse<TNews[]>;
  } catch (error) {
    console.log("Error updating news: ", error);
    return Promise.reject(error);
  }
};

export const ReqUpdateImage = async (id: string, data: any) => {
  try {
    const res = await tekdojoAxios.put(`/news/update-image-url/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data as any;
  } catch (error) {
    console.error("Error updating image:", error);
    return Promise.reject(error);
  }
};

//DELETE METHODS
export const ReqDeleteNews = async (id: string) => {
  try {
    const res = await tekdojoAxios.delete(`/news/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error deleting news: ", error);
    return Promise.reject(error);
  }
};
