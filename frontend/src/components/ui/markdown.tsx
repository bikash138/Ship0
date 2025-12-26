"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Import common language support
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markdown";

interface MarkdownProps {
  content: string;
  className?: string;
}

export default function Markdown({ content, className = "" }: MarkdownProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language) {
              return (
                <div className="relative group my-2">
                  <div className="absolute top-2 right-2 text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-800 dark:bg-zinc-900 px-2 py-1 rounded">
                    {language}
                  </div>
                  <pre className="bg-zinc-900! dark:bg-zinc-950! p-4! rounded-lg! overflow-x-auto border border-zinc-800 dark:border-zinc-700">
                    <code className={`language-${language}`} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }

            // Inline code
            return (
              <code
                className="bg-zinc-100! dark:bg-zinc-800! text-pink-600! dark:text-pink-400! px-1.5! py-0.5! rounded! text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold mt-2 mb-1 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold mt-2 mb-1 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mt-1 mb-0.5 text-foreground">
              {children}
            </h3>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-0 space-y-0 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-0 space-y-0 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground leading-snug">{children}</li>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic my-1 text-zinc-600 dark:text-zinc-400">
              {children}
            </blockquote>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="my-0 leading-snug text-foreground">{children}</p>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border border-zinc-300 dark:border-zinc-700">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-zinc-300 dark:border-zinc-700 px-4 py-2">
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-2 border-t border-zinc-300 dark:border-zinc-700" />
          ),

          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
