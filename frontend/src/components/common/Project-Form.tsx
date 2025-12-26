"use client";
import { useEffect, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/hooks/use-project";
import { useCreateMessage } from "@/hooks/use-messages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AxiosError } from "axios";

const ProjectFormSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: "Content must be at least 10 characters.",
    })
    .max(1000, {
      message: "Content must not be longer than 500 characters.",
    }),
});

const STORAGE_KEY = "ship0_pending_message";

const ProjectForm = ({ projectId, initialPrompt}: { projectId?: string, initialPrompt?: string }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const createProjectMutation = useCreateProject();
  const createMessageMutation = useCreateMessage(projectId || "");

  const isChatMode = !!projectId;

  const isPending = isChatMode
    ? createMessageMutation.isPending
    : createProjectMutation.isPending;

  const form = useForm<z.infer<typeof ProjectFormSchema>>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  useEffect(()=>{
    if(initialPrompt){
      form.setValue("content", initialPrompt, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  },[initialPrompt, form])

  useEffect(() => {
    if (isSignedIn) {
      const storedMessage = localStorage.getItem(STORAGE_KEY);
      if (storedMessage) {
        form.setValue("content", storedMessage);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [isSignedIn, form]);

  const onsubmit = async (data: z.infer<typeof ProjectFormSchema>) => {
    if (!isSignedIn) {
      localStorage.setItem(STORAGE_KEY, data.content);
      router.push("/signin?redirect=home");
      return;
    }
    try {
      if (isChatMode) {
        await createMessageMutation.mutateAsync(data.content, {
          onSuccess: () => {
            form.reset();
          },
        });
      } else {
        const newProject = await createProjectMutation.mutateAsync(
          data.content,
          {
            onSuccess: () => {
              form.reset();
            },
          }
        );
        router.push(`/chat/${newProject.id}`);
        toast.success("Project Created Successfully");
      }
    } catch (error: any) {
      if(error.response) {
        const status = error.response.status
        const errorData = error.response.data
        if(status === 429) {
          toast.error(errorData.error || "Rate limit exceeded", {
            description: errorData.message,
            duration: 5000
          })
        }
        else{
          toast.error(
            errorData.message || 
            (isChatMode ? "Failed to send message" : "Project Creation Failed")
          )
        }
      }
      console.log("Error: ", error);
    }
  };

  return (
    <div
      className={`rounded-2xl transition-colors duration-200 border ${
        isFocused ? "border-primary/50" : "border-border"
      } bg-background p-6 shadow-lg ring-1 ring-black/5 dark:ring-white/5`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <TextareaAutosize
                      {...field}
                      disabled={isPending}
                      placeholder="Ask ship0 to build..."
                      className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base resize-none placeholder:tracking-wider"
                      minRows={2}
                      maxRows={8}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onsubmit)(e);
                        }
                      }}
                    />
                  </div>
                </FormControl>

                <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 hover:bg-card rounded-lg transition-colors text-foreground/60 hover:text-foreground"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-card rounded-lg transition-colors text-foreground/80 hover:text-foreground text-sm font-medium"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      s0 Agent
                      <CaretDownIcon className="h-3 w-3" />
                    </button>
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-xl"
                    disabled={!form.formState.isValid || isPending}
                  >
                    {isPending ? (
                      <Spinner />
                    ) : (
                      <ArrowUpIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;
