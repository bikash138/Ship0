import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "./code-view-theme.css";

interface Props {
  code: string;
  lang: "javascript";
}

export const CodeHighlight = ({ code, lang }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="p-2 bg-transparent border-none rouned-none m-0 text-[11px] leading-relaxed">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};
