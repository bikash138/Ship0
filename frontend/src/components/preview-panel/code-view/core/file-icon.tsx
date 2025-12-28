import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";

interface FileIconProps {
  type: "file" | "folder";
  isOpen?: boolean;
  size?: number;
}

export const FileIcon = ({ type, isOpen, size = 16 }: FileIconProps) => {
  if (type === "folder") {
    return (
      <>
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
          {isOpen ? <ChevronDown size={size} /> : <ChevronRight size={size} />}
        </span>
        <Folder
          size={size}
          className="text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors"
        />
      </>
    );
  }

  return (
    <File
      size={size}
      className="text-muted-foreground group-hover:text-foreground transition-colors"
    />
  );
};
