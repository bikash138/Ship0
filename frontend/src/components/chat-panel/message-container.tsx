"use client";
import { useGetMessages } from "@/hooks/use-messages";
import MessageItem from "./message-item";
import MessageSkeleton from "./message-skeleton";
import { Message } from "@/types";
import ProjectForm from "../common/project-form";
import { useFragment } from "@/contexts/fragment-context";
import { useEffect, useRef } from "react";

const MessageContainer = ({ projectId }: { projectId: string }) => {
  const { data: messages, isLoading } = useGetMessages(projectId);
  const { setSelectedFragment } = useFragment();
  const prevMessagesRef = useRef<Message[]>([]);

  // Auto-select latest fragment when AI response completes
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const prevMessages = prevMessagesRef.current;

    // Find newly completed messages
    messages.forEach((msg) => {
      const prevMsg = prevMessages.find((m) => m.id === msg.id);

      // Check if message just completed
      const wasPending =
        prevMsg?.status === "PENDING" || prevMsg?.status === "QUEUED";
      const isNowSuccess = msg.status === "SUCCESS";

      if (wasPending && isNowSuccess && msg.fragments) {
        // Auto-select the new fragment
        setSelectedFragment(msg.fragments);
      }
    });

    // Update ref
    prevMessagesRef.current = messages;
  }, [messages, setSelectedFragment]);

  if (isLoading) return <MessageSkeleton />;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {messages?.map((msg: Message) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
        {!messages?.length && (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="p-4 shrink-0 bg-background z-10 relative">
        <div className="absolute top-[-50px] left-0 right-0 h-[50px] bg-linear-to-t from-background to-transparent pointer-events-none" />
        <ProjectForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessageContainer;
