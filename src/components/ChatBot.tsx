import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "RANNE-BOT ACTIVATED! 🎮 Ask me anything about Ranne's quests, skills, or projects!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let assistantMessage = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage += parsed.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return newMessages;
                });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ CONNECTION ERROR! Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button - positioned next to settings icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-16 z-50 pixel-border bg-card p-3 text-secondary hover:bg-card/80 transition-transform hover:scale-110"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="font-pixel text-xs">{isOpen ? "✕" : "💬"}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-80 sm:w-96 h-[28rem] flex flex-col bg-card pixel-border overflow-hidden">
          {/* Header */}
          <div className="bg-secondary px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-pixel text-xs text-bg font-bold tracking-wider">
              RANNE-BOT v1.0
            </span>
            <span className="ml-auto flex gap-1">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs text-bg font-retro">ONLINE</span>
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 text-sm font-retro ${
                    msg.role === "user"
                      ? "bg-primary text-bg"
                      : "bg-muted text-foreground border-l-2 border-secondary"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <span className="text-secondary text-xs block mb-1">
                      {">"} RANNE-BOT:
                    </span>
                  )}
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                  {msg.role === "assistant" && i === messages.length - 1 && isLoading && (
                    <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-card border-t-2 border-muted">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="TYPE YOUR MESSAGE..."
                disabled={isLoading}
                className="flex-1 bg-bg text-foreground font-retro text-sm px-3 py-2 border-2 border-muted focus:border-primary outline-none placeholder:text-muted"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="retro-btn retro-btn-primary px-4 py-2 font-pixel text-xs disabled:opacity-50"
              >
                {isLoading ? "..." : "►"}
              </button>
            </div>
            <p className="text-xs text-muted font-retro mt-2 text-center">
              POWERED BY GROQ + LLAMA 3.1 ⚡
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

