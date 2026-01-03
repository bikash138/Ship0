import { useUser } from "@clerk/nextjs";
import SandboxFragment from "./sandbox-fragment";
import { useFragment } from "@/contexts/fragment-context";
import { User, Bot } from "lucide-react";
import { useState } from "react";
import BreathingLoader from "../ui/breathing-loader";
import Markdown from "../ui/markdown";
import { Message } from "@/types";

const MessageItem = ({ msg }: { msg: Message }) => {
  const { user } = useUser();
  const { setSelectedFragment } = useFragment();
  const isUser = msg.role === "USER";
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = isUser && msg.content && msg.content.length > 300;
  const shouldTruncate = isLongMessage && !isExpanded;
  const isPending = msg.status === "PENDING" || msg.status === "QUEUED";
  const isError = msg.status === "FAILED";

  if (!isUser && isPending) {
    return <BreathingLoader />;
  }

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
          isUser
            ? ""
            : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500"
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
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={`relative p-4 text-sm ${
            isUser
              ? "bg-background text-foreground rounded-2xl rounded-tr-sm border border-border shadow-sm"
              : isError
                ? "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl"
                : "bg-transparent text-zinc-700 dark:text-zinc-400 rounded-xl"
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
            {isUser ? (
              msg.content
            ) : isError ? (
              <div className="flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{msg.content || "Something went wrong"}</span>
              </div>
            ) : (
              <Markdown content={msg.content || ""} />
            )}
          </div>

          {isUser && (
            <div className="text-[10px] text-muted-foreground mt-1 text-right">
              {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          )}

          {shouldTruncate && isUser && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
              <button
                onClick={() => setIsExpanded(true)}
                className={`text-xs px-3 py-1 rounded-full shadow-sm hover:bg-opacity-90 transition-all bg-background text-foreground border border-border hover:border-primary/50 cursor-pointer`}
              >
                Show more
              </button>
            </div>
          )}
        </div>

        {/* Sandbox Fragment */}
        {!isUser && msg.fragments && (
          <SandboxFragment
            url={msg.fragments.sandboxUrl}
            title={msg.fragments.title}
            createdAt={msg.fragments.createdAt}
            onClick={() => {
              setSelectedFragment(msg.fragments);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
