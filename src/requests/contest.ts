import { Contest } from "@/types/common-types";
import tekdojoAxios from "./axios.config";
import { BASE_URL } from "@/contants/api-url";

//for get all post (pagination)
export const getContest = async () => {
  try {
    const response = await tekdojoAxios.get(
      `${BASE_URL}/contests?populate=thumbnail`
    );
    return response.data.data[0] as Contest;
  } catch (error) {
    console.error("Error fetching data:", error);
    return;
  }
};
