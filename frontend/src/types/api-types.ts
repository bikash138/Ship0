import { Project } from "./project-type";
import { Message } from "./message-type";
import { CreditUsage } from "./credit-usage-type";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
} & T;

// Project responses
export type GetProjectsResponse = ApiResponse<{ projects: Project[] }>;
export type CreateProjectResponse = ApiResponse<{ newProject: Project }>;
export type GetProjectByIdResponse = ApiResponse<{ project: Project }>;

// Message responses
export type GetMessagesResponse = ApiResponse<{ messages: Message[] }>;
export type CreateMessageResponse = ApiResponse<{ messages: Message[] }>;

// Credit response
export type GetCreditUsageResponse = ApiResponse<{ usageData: CreditUsage }>;
