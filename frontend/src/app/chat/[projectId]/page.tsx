import MessageContainer from "@/components/chat-panel/message-container";
import PreviewPanel from "@/components/preview-panel/preview-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FragmentProvider } from "@/contexts/fragment-context";

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;

  return (
    <FragmentProvider>
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-[200px] w-full rounded-lg"
      >
        <ResizablePanel defaultSize={40} minSize={25} collapsible={false}>
          <MessageContainer projectId={projectId} />
        </ResizablePanel>
        <ResizableHandle withHandle className="border-none bg-transparent" />
        <ResizablePanel
          defaultSize={60}
          minSize={30}
          collapsible={false}
          className="pb-2 pr-1"
        >
          <PreviewPanel projectId={projectId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </FragmentProvider>
  );
};

export default page;
