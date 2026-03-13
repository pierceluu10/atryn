"use client";

import { ChatMessage as ChatMessageType, Resource } from "@/types";
import ResourceCard from "./ResourceCard";

interface Props {
  message: ChatMessageType;
  onCardClick: (resource: Resource) => void;
}

export default function ChatMessage({ message, onCardClick }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] ${
          isUser ? "order-2" : "order-1"
        }`}
      >
        {/* Avatar + name */}
        <div
          className={`flex items-center gap-2 mb-1 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          {!isUser && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          )}
          <span className="text-xs text-gray-400">
            {isUser ? "You" : "Campus Compass"}
          </span>
        </div>

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-white rounded-tr-sm"
              : "bg-gray-50 text-gray-700 rounded-tl-sm border border-gray-100"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Resource cards */}
        {message.cards && message.cards.length > 0 && (
          <div className="mt-3 grid gap-2">
            {message.cards.map((card) => (
              <ResourceCard
                key={card.id}
                resource={card}
                onClick={onCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
