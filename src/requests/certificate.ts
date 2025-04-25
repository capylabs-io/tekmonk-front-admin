import { BASE_URL } from "@/contants/api-url";
import tekdojoAxios from "./axios.config";

export const postCertificate = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/certificates`, { data },
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

export const deleteCertificate = async (id: number) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/certificates/${id}`);
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
export const deleteCertificateHistory = async (id: number) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/certificate-histories/${id}`);
  return response.data;
};


export const postCertificatePdfConfig = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/certificate-pdf-configs`, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getCertificatePdfConfig = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/certificate-pdf-configs?${query}`);
  return response.data;
};

export const findCertificatePdfConfig = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/certificate-pdf-configs?${query}`);
  return response.data;
};
export const updateCertificatePdfConfig = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/certificate-pdf-configs/${id}`, { data });
  return response.data;
};

export const postCertificatePdfConfigField = async (data: any) => {
  const response = await tekdojoAxios.post(`${BASE_URL}/certificate-pdf-field-configs`, { data });
  return response.data;
};

export const getCertificatePdfConfigField = async (query: string = "") => {
  const response = await tekdojoAxios.get(`${BASE_URL}/certificate-pdf-field-configs?${query}`);
  return response.data;
};

export const updateCertificatePdfConfigField = async (id: number, data: any) => {
  const response = await tekdojoAxios.put(`${BASE_URL}/certificate-pdf-field-configs/${id}`, { data });
  return response.data;
};

export const deleteCertificatePdfConfigField = async (id: number) => {
  const response = await tekdojoAxios.delete(`${BASE_URL}/certificate-pdf-field-configs/${id}`);
  return response.data;
};







