"use client";
import { useState } from "react";
import { useGetMessages } from "@/hooks/use-messages";
import { User, Bot } from "lucide-react";
import ProjectForm from "../common/Project-Form";
import { useUser } from "@clerk/nextjs";

const MessageItem = ({ msg }: { msg: any }) => {
  const { user } = useUser();
  const isUser = msg.role === "USER";
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = isUser && msg.content && msg.content.length > 300;
  const shouldTruncate = isLongMessage && !isExpanded;

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
          isUser ? "" : "bg-amber-100 text-amber-600"
        }`}
      >
        {isUser ? (
          user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="User"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={16} className="text-zinc-400" />
          )
        ) : (
          <Bot size={16} />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`relative max-w-[80%] p-4 rounded-xl text-sm ${
          isUser
            ? "bg-zinc-900 text-zinc-100 rounded-tr-none"
            : "bg-transparent text-zinc-400"
        }`}
      >
        <div
          className={`whitespace-pre-wrap ${
            isUser && shouldTruncate ? "max-h-[150px] overflow-hidden" : ""
          }`}
          style={
            shouldTruncate && isUser
              ? {
                  maskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                }
              : undefined
          }
        >
          {msg.content}
        </div>

        {shouldTruncate && isUser && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
            <button
              onClick={() => setIsExpanded(true)}
              className={`text-xs px-3 py-1 rounded-full shadow-sm hover:bg-opacity-90 transition-all bg-zinc-900 text-gray-300 hover:text-white cursor-pointer`}
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageContainer = ({ projectId }: { projectId: string }) => {
  const { data: messages, isLoading } = useGetMessages(projectId);

  if (isLoading) return <div className="p-4">Loading messages...</div>;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages Area - Flex 1 to take available space and scroll */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {messages?.map((msg: any) => (
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
