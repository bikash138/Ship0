import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

interface CreditUsage {
  consumed: number;
  remaining: number;
  total: number;
}


export const useCreditUsage = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["creditUsage"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get("http://localhost:4000/api/v1/credits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data?.success) {
        throw new Error("Something went wrong while fetching the usage");
      }
      return response.data.usageData as CreditUsage
    },
  });
};
