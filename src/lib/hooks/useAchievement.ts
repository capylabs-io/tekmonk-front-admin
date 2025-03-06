"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Achievement } from "@/types/common-types";

const API_URL = "http://localhost:3500/achievements";

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(API_URL);
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievement:", error);
      }
    };

    fetchAchievements();
  }, []);

  return achievements;
};
