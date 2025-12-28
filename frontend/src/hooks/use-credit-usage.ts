import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";
import { GetCreditUsageResponse } from "@/types";

const { CREDITS } = API_ENDPOINTS;

export const useCreditUsage = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["creditUsage"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get<GetCreditUsageResponse>(CREDITS.GET, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data?.success) {
        throw new Error("Something went wrong while fetching the usage");
      }
      return response.data.usageData;
    },
  });
};
