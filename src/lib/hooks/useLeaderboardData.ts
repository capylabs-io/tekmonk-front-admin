"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { LeaderboardData } from "@/types/common-types";
import { API_LEADERBOARD_DATAS } from "@/contants/api-url";

export const useLeaderboardDatas = () => {
  const [leaderboardDatas, setLeaderboardDatas] = useState<LeaderboardData[]>(
    []
  );

  useEffect(() => {
    const fetchLeaderboardDatas = async () => {
      try {
        const response = await axios.get(API_LEADERBOARD_DATAS);
        setLeaderboardDatas(response.data);
      } catch (error) {
        console.error("Error fetching leaderboardData cards:", error);
      }
    };

    fetchLeaderboardDatas();
  }, []);

  return leaderboardDatas;
};
