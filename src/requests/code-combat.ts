import { TProgressResult } from "@/types/common-types";
import tekdojoAxios from "./axios.config";
export const getProgress = async (memberId: string, classIndex: number) => {
  try {
    const res = await tekdojoAxios.get(
      `/codecombat/progress/?memberId=${memberId}&classIndex=${classIndex}`
    );
    if (res.status === 200) {
      return res.data as TProgressResult[];
    }
    return 0;
  } catch (error) {
    return 0;
  }
};
