"use client";
import { useState } from "react";
import { Achievement } from "@/types/common-types";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ReqGetAllAchievement } from "@/requests/achievement";

export const useAchievement = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const useAchievementQuery = useQuery({
    queryKey: ["achievement", page, limit],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: limit,
          },
        });
        return await ReqGetAllAchievement(queryString);
      } catch (error) {
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  return {
    totalPage,
    totalDocs,
    limit,
    page,
    isOpenCreateModal,
    setIsOpenCreateModal,
    setLimit,
    setPage,
    useAchievementQuery,
  };
};
