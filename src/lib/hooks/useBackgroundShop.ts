"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackgroundShop } from "@/types/common-types";

const API_URL = "http://localhost:3500/backgroundShops";

export const useBackgroundShops = () => {
  const [backgroundshops, setBackgroundShops] = useState<BackgroundShop[]>([]);

  useEffect(() => {
    const fetchBackgroundShops = async () => {
      try {
        const response = await axios.get(API_URL);
        setBackgroundShops(response.data);
      } catch (error) {
        console.error("Error fetching backgroundShop:", error);
      }
    };

    fetchBackgroundShops();
  }, []);

  return backgroundshops;
};
