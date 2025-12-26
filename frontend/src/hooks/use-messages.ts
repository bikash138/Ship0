import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const URI = "http://localhost:4000/api/v1";

export const prefetchMessage = async (
  projectId: string,
  queryClient: any,
  getToken: () => Promise<string | null>
) => {
  await queryClient.prefetchQuery({
    queryKey: ["messages", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${URI}/messages/get-all-messages`, {
        params: { projectId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch messages");
      }
      return response.data.messages;
    },
    staleTime: 10000,
  });
};

export const useGetMessages = (projectId: string) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["messages", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${URI}/messages/get-all-messages`, {
        params: { projectId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch messages");
      }
      return response.data.messages;
    },
    staleTime: 10000,
    refetchInterval: (query) => {
      const messages = query.state.data as any[];
      const hasPendingMessage = messages?.some(
        (msg) => msg.status === "PENDING" || msg.status === "QUEUED"
      );
      return hasPendingMessage ? 2000 : false;
    },
  });
};

export const useCreateMessage = (projectId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (content: string) => {
      const token = await getToken();
      const response = await axios.post(
        `${URI}/messages/create-message`,
        { projectId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch messages");
      }
      return response.data.messages;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", projectId] });
      queryClient.invalidateQueries({ queryKey: ["creditUsage"] });
    },
  });
};
