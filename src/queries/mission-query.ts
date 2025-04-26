import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { getMission } from "@/requests/mission";

export const useMissionQuery = (
  activeTab: { id: string },
  currentPage: number,
  itemsPerPage: number,
  searchQuery: string
) => {
  return useQuery({
    queryKey: [
      "missionList",
      activeTab.id,
      currentPage,
      itemsPerPage,
      searchQuery,
    ],
    queryFn: async () => {
      try {
        const filters = {
          type: activeTab.id,
        };

        // Only add search filter if searchQuery is not empty
        if (searchQuery) {
          Object.assign(filters, {
            $or: [
              {
                title: {
                  $containsi: searchQuery,
                },
              },
              {
                description: {
                  $containsi: searchQuery,
                },
              },
            ],
          });
        }

        const queryString = qs.stringify({
          filters,
          populate: ["class", "teacher"],
          pagination: {
            page: currentPage,
            pageSize: itemsPerPage,
          },
        });
        return await getMission(queryString);
      } catch (error) {
        console.log("error when fetching mission list", error);
      }
    },
    refetchOnWindowFocus: false,
  });
};
