import { PostType } from "@/types";
import tekdojoAxios from "./axios.config";
import { BASE_URL } from "@/contants/api-url";

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

export const uploadPost = async (postBody: PostType) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/users/me`, postBody);
  return response.data;
};
