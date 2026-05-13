import React, { useState, useRef, useEffect, useCallback } from "react";

export type ProjectDemoPersona = "luffy" | "cat" | "morpheus";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PERSONA_OPTIONS: { id: ProjectDemoPersona; label: string }[] = [
  { id: "luffy", label: "LUFFY (demo)" },
  { id: "cat", label: "CAT-BOT" },
  { id: "morpheus", label: "MORPHEUS (demo)" },
];

const WELCOME_BY_PERSONA: Record<ProjectDemoPersona, string> = {
  luffy:
    "The sea's calling and my stomach's rumbling — what's your next adventure? Tell me what you're chasing.",
  cat: "Mrrp? …Prrrrrrt. *nose boop*",
  morpheus:
    "You found a small window. Speak plainly: what do you want to understand about yourself today?",
};

const HEADER_TITLE: Record<ProjectDemoPersona, string> = {
  luffy: "LUFFY-DEMO v1.0",
  cat: "CAT-BOT v1.0",
  morpheus: "MORPHEUS-DEMO v1.0",
};

const BUBBLE_PREFIX: Record<ProjectDemoPersona, string> = {
  luffy: "> LUFFY-DEMO:",
  cat: "> CAT-BOT:",
  morpheus: "> MORPHEUS-DEMO:",
};

function streamErrorMessage(status: number): string {
  if (import.meta.env.DEV && (status === 404 || status === 405)) {
    return "Can't reach the chat API. Add GROQ_API_KEY to .env.local and restart npm run dev.";
  }
  return "Something went wrong. Try again in a moment.";
}

export const ProjectsPersonaChat: React.FC = () => {
  const [persona, setPersona] = useState<ProjectDemoPersona>("luffy");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_BY_PERSONA.luffy },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTranscriptToBottom = useCallback(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollTranscriptToBottom();
  }, [messages, scrollTranscriptToBottom]);

  const resetThreadForPersona = useCallback((next: ProjectDemoPersona) => {
    setPersona(next);
    setMessages([{ role: "assistant", content: WELCOME_BY_PERSONA[next] }]);
    setInput("");
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    let failureText = "Something went wrong. Try again in a moment.";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6),
          persona,
        }),
      });

      if (!response.ok) {
        failureText = streamErrorMessage(response.status);
        throw new Error(`HTTP ${response.status}`);
      }

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
                  const nextMsgs = [...prev];
                  nextMsgs[nextMsgs.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return nextMsgs;
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
      if (import.meta.env.DEV && failureText === "Something went wrong. Try again in a moment.") {
        failureText =
          "Can't reach the chat API. Add GROQ_API_KEY to .env.local and restart npm run dev (or deploy to Vercel).";
      }
      setMessages((prev) => [...prev, { role: "assistant", content: failureText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="project-rag-demo" aria-labelledby="projects-persona-chat-title">
      <div className="project-rag-demo__intro">
        <p className="project-rag-demo__kicker">CHATBOT RAG CORE — live demo</p>
        <h4 className="project-rag-demo__title" id="projects-persona-chat-title">
          Persona routing (hosted Groq)
        </h4>
        <p className="project-rag-demo__blurb">
          The <strong>chatbot-rag-core</strong> repo is local-first: Ollama + LlamaIndex for document RAG. This
          block is a small <strong>hosted</strong> cousin: same idea of swapping <strong>system prompts</strong> per
          voice, streaming here via Groq — character-first, not PDF Q&A.
        </p>
        <div className="project-rag-demo__tags" aria-hidden>
          <span className="tag">GROQ</span>
          <span className="tag">STREAM</span>
          <span className="tag">DEMO</span>
        </div>
      </div>

      <div className="project-rag-demo__toolbar">
        <span className="project-rag-demo__toolbar-title">{HEADER_TITLE[persona]}</span>
        <label>
          <span className="sr-only">Persona</span>
          <select
            className="project-rag-demo__select"
            value={persona}
            onChange={(e) => resetThreadForPersona(e.target.value as ProjectDemoPersona)}
          >
            {PERSONA_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <span className="project-rag-demo__stream project-rag-demo__stream--desktop-only">
          <span className="project-rag-demo__stream-dot" aria-hidden />
          STREAM
        </span>
      </div>
      <div className="project-rag-demo__toolbar-row2">
        <span className="project-rag-demo__stream">
          <span className="project-rag-demo__stream-dot" aria-hidden />
          STREAM
        </span>
      </div>

      <div ref={messagesScrollRef} className="project-rag-demo__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`project-rag-demo__row ${msg.role === "user" ? "project-rag-demo__row--user" : ""}`}
          >
            <div
              className={`project-rag-demo__bubble ${
                msg.role === "user" ? "project-rag-demo__bubble--user" : "project-rag-demo__bubble--assistant"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="project-rag-demo__bubble-label">{BUBBLE_PREFIX[persona]}</span>
              )}
              <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
              {msg.role === "assistant" && i === messages.length - 1 && isLoading && (
                <span className="project-rag-demo__caret" aria-hidden />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="project-rag-demo__footer">
        <div className="project-rag-demo__input-row">
          <input
            ref={inputRef}
            className="project-rag-demo__input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="TYPE YOUR MESSAGE..."
            disabled={isLoading}
          />
          <button
            type="button"
            className="project-rag-demo__send"
            onClick={() => void sendMessage()}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "…" : "SEND"}
          </button>
        </div>
        <p className="project-rag-demo__legal">
          Powered by Groq + Llama 3.1. Personas are unofficial demo voices; not endorsed by IP owners.
        </p>
      </div>
    </div>
  );
};
