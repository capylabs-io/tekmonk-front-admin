import { ReqGetUserRoles } from "@/requests/user-role";
import { useQuery } from "@tanstack/react-query";

export const useUserRole = () => {
  return useQuery({
    queryKey: ["user-role"],
    queryFn: async () => ReqGetUserRoles(),
    refetchOnWindowFocus: false,
  });
};
