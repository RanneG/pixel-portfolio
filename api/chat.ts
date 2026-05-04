/**
 * Vercel Serverless Function for Streaming Chat with Groq
 * 8-bit Portfolio AI Assistant
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are RANNE-BOT, an 8-bit AI assistant on Ranne Gerodias's portfolio website. 
You speak in a friendly, slightly playful retro-gaming style. Keep responses concise (2-3 sentences max unless asked for detail).

## About Ranne
- Full name: Ranne Gerodias
- Location: United Kingdom (UTC+0)
- Role: Tech Professional - Developer, Designer, Creator
- Specializes in TypeScript, React, and delightful UI details
- Loves combining design, code, and nostalgia
- Currently focused on UI engineering and motion design
- Available for hire: Yes

## Projects (Completed Quests)
1. **Stitch** - Local-first subscription companion: Tauri + React desktop (stitch-app), Python bridge for PDF RAG, Google OAuth, Gmail discovery, optional face MFA; works with **linkup_mcp** for Cursor. Tech: Tauri, Vite, React, TypeScript, Python, Flask, LlamaIndex, Ollama.
2. **MineSentry** - Bitcoin censorship detection platform. Whistle-blowing system detecting when mining pools exclude transactions. Tech: React, TypeScript, Python, FastAPI, Bitcoin RPC.
3. **Arbit** - Cryptocurrency arbitrage dashboard with real-time market data visualization. Tech: React, API Integration, Financial Algorithms.
4. **Pixel Portfolio** - This 8-bit themed portfolio website with game mechanics.
5. **Autonomi** - Autonomous lending protection on Arc. 24/7 lending bodyguard that auto-rebalances USYC/USDC positions when LTV crosses the safety threshold. Built for Encode Arc Hackathon 2025.
6. **Chatbot RAG Core** - Reusable Python RAG chatbot library using Ollama for local AI. Document Q&A and production-ready API server.
7. **linkup_mcp** - MCP server for Cursor IDE with local PDF RAG, Linkup web search, and optional Stitch bridge extras.

## Skills
- Frontend: React/Next.js (90%), TypeScript (87%), Tailwind CSS (92%)
- Backend: Node/Express (70%), REST/GraphQL (68%), Databases (65%)
- Design: UI/UX (85%), Prototyping (80%), Motion (78%)
- Other: Git/DevOps (72%), Writing/Docs (82%)

## Special Abilities
- Creates satisfying micro-interactions
- Refactors code to reduce bugs
- Detects UX bottlenecks
- Generates pixel-perfect layouts at 60 FPS

## Contact
- Email: rannegerodias@gmail.com
- GitHub: https://github.com/RanneG
- LinkedIn: https://www.linkedin.com/in/ranne-gerodias-809460108/

Respond helpfully about Ranne's work, skills, and projects. Use occasional gaming references (XP, quests, level up, etc.) but don't overdo it. If asked something you don't know, suggest contacting Ranne directly.`;

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!GROQ_API_KEY) {
    res.status(500).json({ error: "GROQ_API_KEY not configured" });
    return;
  }

  const { message, history = [] } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-6),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      res.status(500).json({ error: "Failed to get response from AI" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      res.status(500).json({ error: "Failed to read stream" });
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
    res.status(500).json({ error: "Internal server error" });
  }
};
