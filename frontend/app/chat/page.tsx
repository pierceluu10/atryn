"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChatMessage as ChatMessageType, Resource } from "@/types";
import ChatMessage from "@/components/ChatMessage";
import ResourceDetail from "@/components/ResourceDetail";
import SuggestionChips from "@/components/SuggestionChips";
import { sendChat } from "@/lib/api";

const WELCOME_MESSAGE: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to Campus Compass! I can help you discover labs, professors, services, and opportunities on campus. Tell me about your interests, or try one of the suggestions below.",
  timestamp: Date.now(),
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await sendChat(messageText, history);

      const assistantMsg: ChatMessageType = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: response.reply,
        cards: response.cards,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessageType = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "I'm sorry, something went wrong. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  function handleAddMessage(msg: string) {
    const assistantMsg: ChatMessageType = {
      id: `asst-${Date.now()}`,
      role: "assistant",
      content: msg,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
  }

  const showSuggestions = messages.length <= 1;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between bg-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
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
          <span className="font-serif text-lg text-primary">Campus Compass</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setMessages([WELCOME_MESSAGE]);
              setSelectedResource(null);
            }}
            className="text-xs text-gray-400 hover:text-primary transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
          >
            New Chat
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 md:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onCardClick={setSelectedResource}
            />
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Try asking:</p>
              <SuggestionChips onSelect={handleSend} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about labs, professors, services, or opportunities..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-primary text-white p-3 rounded-xl hover:bg-primary-light disabled:opacity-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-300 text-center mt-2">
            Campus Compass uses curated data. Results are for discovery — always verify details directly.
          </p>
        </div>
      </div>

      {/* Resource detail panel */}
      {selectedResource && (
        <ResourceDetail
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onAddMessage={handleAddMessage}
        />
      )}
    </div>
  );
}
