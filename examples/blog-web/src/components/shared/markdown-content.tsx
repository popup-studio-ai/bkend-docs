"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-accent-color prose-blockquote:text-muted-foreground prose-code:text-foreground prose-headings:mt-8 prose-headings:mb-4 prose-p:my-4 prose-p:leading-8 prose-li:leading-8 prose-li:text-foreground prose-ul:my-4 prose-ol:my-4 prose-blockquote:my-6 prose-pre:my-6 prose-pre:bg-muted prose-pre:text-foreground prose-code:bg-muted/50 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-hr:my-8 prose-hr:border-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
