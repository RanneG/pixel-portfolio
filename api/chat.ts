/**
 * Vercel Serverless Function for Streaming Chat with Groq
 * Projects-page demo: character-first personas (luffy | cat | morpheus)
 */

import { handleGroqPersonaChatBody } from "./chatStream";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export default async function handler(req: any, res: any) {
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

  await handleGroqPersonaChatBody(req.body ?? {}, GROQ_API_KEY, res);
}
