import { z } from "zod";

export const createMessageSchema = z.object({
  content: z.string().min(4).max(1000),
  projectId: z.string(),
});
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
