/**
 * Vercel Serverless Function for Health Check
 * This file should be in the /api directory for Vercel
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "8-bit-portfolio",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.VERCEL_ENV || "development",
    region: process.env.VERCEL_REGION || "unknown"
  };

  res.status(200).json(health);
}

