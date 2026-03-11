"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { IhsanLogo } from "./ihsan-logo";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

function ChatMessageInner({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 min-w-0 w-full ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
          isUser
            ? "bg-emerald-100 text-emerald-700"
            : "bg-gradient-to-br from-emerald-600 to-emerald-800 p-0.5"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <IhsanLogo size={20} />}
      </div>

      {/* Content */}
      <div
        className={`min-w-0 max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed overflow-x-auto ${
          isUser
            ? "bg-emerald-600 text-white rounded-tr-sm"
            : "bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-200/80"
        }`}
      >
        {message.content ? (
          isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <div className="chat-md [&>*:first-child]:mt-0" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-[15px] font-bold text-gray-900 mt-3 mb-1.5 pb-1 border-b border-gray-200">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-[14px] font-bold text-gray-900 mt-2.5 mb-1">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-[13px] font-semibold text-gray-900 mt-2 mb-1">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0 text-gray-700 whitespace-pre-wrap break-words">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-2 ml-1 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-2 ml-1 space-y-1 list-decimal list-inside">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[13px] text-gray-700 flex gap-1.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">&#8226;</span>
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-[3px] border-emerald-400 bg-emerald-50/50 rounded-r-lg pl-3 pr-2 py-1.5 my-2 text-gray-600 text-[12px] italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    return isBlock ? (
                      <pre className="bg-gray-800 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono">
                        <code>{children}</code>
                      </pre>
                    ) : (
                      <code className="bg-emerald-100/60 text-emerald-800 rounded px-1.5 py-0.5 text-[11px] font-mono">
                        {children}
                      </code>
                    );
                  },
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2.5 rounded-lg border border-gray-200">
                      <table className="text-[12px] border-collapse w-full min-w-[280px]">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-emerald-50 text-emerald-900">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-gray-100">{children}</tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-gray-50/50">{children}</tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-2.5 py-1.5 text-left font-semibold text-[11px] uppercase tracking-wide border-b border-emerald-200">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-2.5 py-2 text-gray-700 align-top">{children}</td>
                  ),
                  hr: () => <hr className="my-3 border-gray-200" />,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 underline decoration-emerald-300 hover:text-emerald-800 hover:decoration-emerald-500 transition-colors"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )
        ) : isStreaming ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

// Memo to avoid re-rendering completed messages when new chunks arrive
export const ChatMessage = memo(ChatMessageInner, (prev, next) => {
  return prev.message.content === next.message.content && prev.isStreaming === next.isStreaming;
});
