import tekdojoAxios from "./axios.config";

export const forgotPasswordRequest = async (email: string) => {
  try {
    const data = {
      email: email,
    };
    const res = await tekdojoAxios.post("/custom-forgot-password", data);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetPasswordRequest = async (data: any) => {
  try {
    const res = await tekdojoAxios.post("/custom-reset-password", data);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
