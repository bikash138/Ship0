import { useUser } from "@clerk/nextjs";
import SandboxFragment from "./sandbox-fragment";
import { useFragment } from "@/contexts/fragment-context";
import { User, Bot } from "lucide-react";
import { useState } from "react";

const MessageItem = ({ msg }: { msg: any }) => {
  const { user } = useUser();
  const { setSelectedFragment } = useFragment();
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
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={`relative p-4 rounded-xl text-sm ${
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
