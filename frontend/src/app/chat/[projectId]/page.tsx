import MessageContainer from "@/components/chat/MessageContainer";
import ResizableSidebar from "@/components/ResizableSidebar";

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ResizableSidebar>
        <MessageContainer projectId={projectId} />
      </ResizableSidebar>
      <div className="flex-1 p-6">
        <h1>THis is the project with the id {projectId}</h1>
      </div>
    </div>
  );
};

export default page;
