"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Certificate } from "@/types/common-types";

const API_URL = "http://localhost:3500/certificates";

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(API_URL);
        setCertificates(response.data);
      } catch (error) {
        console.error("Error fetching certificate:", error);
      }
    };

    fetchCertificates();
  }, []);

  return certificates;
};
