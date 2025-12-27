import { z } from "zod";

export const createProjectSchema = z.object({
  content: z.string().min(4).max(1000),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
