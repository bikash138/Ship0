import { API_ENDPOINTS } from "@/config/api";
import {
  CreateProjectResponse,
  GetProjectByIdResponse,
  GetProjectsResponse,
} from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const { PROJECTS } = API_ENDPOINTS;

export const useGetProjects = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get<GetProjectsResponse>(PROJECTS.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch projects");
      }
      return response.data.projects;
    },
  });
};

export const useCreateProject = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const token = await getToken();
      const response = await axios.post<CreateProjectResponse>(
        PROJECTS.CREATE,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.success) {
        throw new Error("Failed to Create projects");
      }
      return response.data.newProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["creditUsage"] });
    },
  });
};

export const useGetProjectById = (projectId: string) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get<GetProjectByIdResponse>(
        PROJECTS.GET_BY_ID(projectId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch project by id");
      }
      return response.data.project;
    },
  });
};
