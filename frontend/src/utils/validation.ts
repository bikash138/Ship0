import { z } from "zod";

export const projectFormSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: "Content must be at least 10 characters",
    })
    .max(1000, {
      message: "Content must not be longer than 1000 characters",
    }),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
