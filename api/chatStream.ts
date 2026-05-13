/**
 * Shared Groq streaming handler for /api/chat (Vercel + Vite dev middleware).
 */

import {
  buildCharacterSystemPrompt,
  resolvePersona,
  PERSONA_TEMPERATURE,
  type DemoPersonaId,
} from "./personaSheets";

export type ChatRequestBody = {
  message?: string;
  history?: Array<{ role: string; content: string }>;
  persona?: unknown;
};

/** Works with Node `ServerResponse` and Vercel's response object */
export type ChatSseResponse = {
  statusCode?: number;
  status?: (code: number) => unknown;
  setHeader(name: string, value: string | number | readonly string[]): void;
  write(chunk: string | Buffer): boolean | void;
  end(chunk?: string | Buffer): void;
  headersSent?: boolean;
};

function setHttpStatus(res: ChatSseResponse, code: number) {
  if (typeof res.status === "function") {
    res.status(code);
  } else {
    res.statusCode = code;
  }
}

function sendJsonError(res: ChatSseResponse, code: number, payload: unknown) {
  setHttpStatus(res, code);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export async function handleGroqPersonaChatBody(
  body: ChatRequestBody,
  apiKey: string | undefined,
  res: ChatSseResponse
): Promise<void> {
  if (!apiKey) {
    sendJsonError(res, 500, { error: "GROQ_API_KEY not configured" });
    return;
  }

  const { message, history = [], persona: personaRaw } = body;
  const persona: DemoPersonaId = resolvePersona(personaRaw);

  if (!message) {
    sendJsonError(res, 400, { error: "Message is required" });
    return;
  }

  try {
    const systemContent = buildCharacterSystemPrompt(persona);
    const messages = [
      { role: "system", content: systemContent },
      ...history.slice(-6),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        stream: true,
        max_tokens: 500,
        temperature: PERSONA_TEMPERATURE[persona],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      sendJsonError(res, 500, { error: "Failed to get response from AI" });
      return;
    }

    setHttpStatus(res, 200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      sendJsonError(res, 500, { error: "Failed to read stream" });
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            res.write("data: [DONE]\n\n");
            break;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error("Chat error:", error);
    if (res.headersSent) {
      try {
        res.end();
      } catch {
        /* ignore */
      }
      return;
    }
    sendJsonError(res, 500, { error: "Internal server error" });
  }
}
