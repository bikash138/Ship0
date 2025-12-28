import { useFragment } from "@/contexts/fragment-context";
import { useGetMessages } from "./use-messages";
import { useEffect, useMemo } from "react";
import { Message } from "@/types";

export const useFragmentSelection = (projectId: string) => {
  const { data: messages, isLoading } = useGetMessages(projectId);
  const { selectedFragment, setSelectedFragment } = useFragment();

  // Extract fragments from messages
  const fragments = useMemo(() => {
    if (!messages) return [];
    return (messages as Message[])
      .filter((msg) => msg.role === "ASSISTANT" && msg.fragments)
      .map((msg) => msg.fragments!);
  }, [messages]);

  useEffect(() => {
    if (fragments.length > 0 && !selectedFragment) {
      setSelectedFragment(fragments[fragments.length - 1]);
    }
  }, [fragments, selectedFragment, setSelectedFragment]);

  return { fragments, selectedFragment, isLoading };
};
