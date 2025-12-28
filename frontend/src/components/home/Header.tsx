"use client";
import { usePathname } from "next/navigation";
import { ChatHeader } from "../common/headers/chat-header";
import PublicHeader from "../common/headers/public-header";

export function Header() {
  const pathname = usePathname();
  const isChatPage = pathname?.includes("chat");
  const projectId = isChatPage ? pathname.split("/")[2] : "";

  return (
    <>{isChatPage ? <ChatHeader projectId={projectId} /> : <PublicHeader />}</>
  );
}
