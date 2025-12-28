const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api/v1";

export const API_ENDPOINTS = {
  PROJECTS: {
    CREATE: `${BASE_URL}/projects/create-project`,
    GET_ALL: `${BASE_URL}/projects/get-all-projects`,
    GET_BY_ID: (projectId: string) => `${BASE_URL}/projects/${projectId}`,
  },
  MESSAGES: {
    GET_ALL: `${BASE_URL}/messages/get-all-messages`,
    CREATE: `${BASE_URL}/messages/create-message`,
  },
  CREDITS: {
    GET: `${BASE_URL}/credits`,
  },
} as const;
