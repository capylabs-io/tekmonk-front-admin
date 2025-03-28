import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";

export const postCertificate = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/certificates`, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const findCertificate = async (id: number) => {
  const response = await tekdojoAxios.get(`${BASE_URL}/certificates/${id}`);
  return response.data;
};

export const getCertificate = async (query: string = "") => {
  const response = await tekdojoAxios.get(
    `${BASE_URL}/certificates?${query}`
  );
  return response.data;
};
export const updateCertificate = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/certificates/${id}`, { data });
  return response.data;
};
export const postCertificateHistory = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/certificate-histories`, { data },
  );
  return response.data;
};
export const getCertificateHistory = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/certificate-histories?${query}`
  );
  return response.data;
};
export const updateCertificateHistory = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/certificate-histories/${id}`, { data });
  return response.data;
};


