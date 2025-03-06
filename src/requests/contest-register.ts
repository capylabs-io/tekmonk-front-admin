import tekdojoAxios from "./axios.config";
import { BASE_URL } from "@/contants/api-url";
import moment from "moment";
export const contestRegister = async (body: any) => {
  if (body.dateOfBirth) {
    // Chuyển đổi sang định dạng "YYYY-MM-DD" (loại bỏ múi giờ)
    body.dateOfBirth = moment(body.dateOfBirth, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
  }
  const response = await tekdojoAxios.post(
    `${BASE_URL}/auth/local/register`,
    body
  );
  return response.data;
};
