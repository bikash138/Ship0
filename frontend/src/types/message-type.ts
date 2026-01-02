import { FileMap } from "./file-type";

export type MessageRole = "USER" | "ASSISTANT";
export type MessageType = "RESULT" | "ERROR";
export type MessageStatus = "QUEUED" | "PENDING" | "SUCCESS" | "FAILED";

export interface Fragment {
  id: string;
  messageId: string;
  sandboxUrl: string;
  sandboxId: string;
  title: string;
  files: FileMap;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  type: MessageType;
  status: MessageStatus;
  projectId: string;
  fragments: Fragment | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageWithFragment extends Message {
  fragments: Fragment;
}
