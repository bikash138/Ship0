import { useUser } from "@clerk/nextjs";
import SandboxFragment from "./sandbox-fragment";
import { useFragment } from "@/contexts/fragment-context";
import { User, Bot } from "lucide-react";
import { useState } from "react";
import BreathingLoader from "../ui/breathing-loader";

const MessageItem = ({ msg }: { msg: any }) => {
  const { user } = useUser();
  const { setSelectedFragment } = useFragment();
  const isUser = msg.role === "USER";
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = isUser && msg.content && msg.content.length > 300;
  const shouldTruncate = isLongMessage && !isExpanded;
  const isPending = msg.status === "PENDING" || msg.status === "QUEUED"

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
            {msg.content}
          </div>

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
