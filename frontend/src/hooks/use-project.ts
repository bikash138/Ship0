import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from 'axios'

const URI = "http://localhost:4000/api/v1";

export const useGetProjects = () => {
  const {getToken} = useAuth()
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const token = await getToken()
      const response = await axios.get(`${URI}/projects/get-all-projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(!response.data.success){
        throw new Error("Failed to fetch projects")
      }
      return response.data.projects
    }
  })
}

export const useCreateProject = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      const token = await getToken();
      const response = await axios.post(
        `${URI}/projects/create-project`,
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
      const response = await axios.get(`${URI}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch project by id");
      }
      return response.data.project;
    },
  });
};