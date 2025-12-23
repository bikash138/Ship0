"use client";
import MessageContainer from "./message-container";
import ProjectForm from "../common/project-form";

const ChatPanel = ({ projectId }: { projectId: string }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <MessageContainer projectId={projectId} />
      <div className="p-4 bg-white/50 border-t border-gray-100">
        <ProjectForm projectId={projectId} />
      </div>
    </div>
  );
};

export default ChatPanel;
