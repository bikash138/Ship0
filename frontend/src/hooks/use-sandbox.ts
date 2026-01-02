import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/api";
import axios from "axios";
import { RecreateSandboxResponse, GetHealthRespose } from "@/types";

const { SANDBOX } = API_ENDPOINTS;

export const useCheckSandboxHealth = (sandboxId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["sandbox-health", sandboxId],
    queryFn: async () => {
      if (!sandboxId) {
        throw new Error("Sanbox Id is required");
      }
      const token = await getToken();
      const response = await axios.get<GetHealthRespose>(
        `${SANDBOX.HEALTH}?sandboxId=${sandboxId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.success) {
        throw new Error("Health check failed");
      }
      return response.data.isAlive;
    },
    enabled: !!sandboxId,
    staleTime: 0,
    retry: 1,
    refetchOnMount: true,
  });
};

export const useRecreateSandbox = () => {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      fragmentId,
      files,
    }: {
      fragmentId: string;
      files: Record<string, string>;
    }) => {
      const token = await getToken();
      const response = await axios.post<RecreateSandboxResponse>(
        SANDBOX.RECREATE,
        { fragmentId, files },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.success) {
        throw new Error("Failed to recreate sandbox");
      }
      return {
        sandboxUrl: response.data.sandboxUrl,
        sandboxId: response.data.sandboxId,
      };
    },
  });
};
