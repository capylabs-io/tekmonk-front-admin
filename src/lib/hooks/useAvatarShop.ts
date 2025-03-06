"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { AvatarShop } from "@/types/common-types";

const API_URL = "http://localhost:3500/avatarShops";

export const useAvatarShops = () => {
  const [avatarshops, setAvatarShops] = useState<AvatarShop[]>([]);

  useEffect(() => {
    const fetchAvatarShops = async () => {
      try {
        const response = await axios.get(API_URL);
        setAvatarShops(response.data);
      } catch (error) {
        console.error("Error fetching avatarShop:", error);
      }
    };

    fetchAvatarShops();
  }, []);

  return avatarshops;
};
