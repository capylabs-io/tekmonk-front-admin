import { CourseMission } from "@/types/course";
import tekdojoAxios from "./axios.config";
import { StrapiResponse } from "./strapi-response-pattern";
import { BASE_URL } from "@/contants/api-url";

export const ReqGetCourseMissions = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/course-missions?${query}`);
  return response.data as StrapiResponse<CourseMission[]>;
};