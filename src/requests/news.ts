import tekdojoAxios from "./axios.config";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getNews = async (filter?: string) => {
  const url = filter ? `${BASE_URL}/news?${filter}` : `${BASE_URL}/news`;
  const response = await tekdojoAxios.get(url);
  return response.data;
};

export const createNews = async (formData: FormData) => {
  const url = `${BASE_URL}/news`;
  const response = await tekdojoAxios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
