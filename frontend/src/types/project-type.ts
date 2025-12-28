import { Message } from "./message-type";

export interface Project {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithMessages extends Project {
  messages: Message[];
}
