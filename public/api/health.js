/**
 * Health check endpoint for monitoring
 * This file should be served as a static file or via serverless function
 */

export default function handler(req, res) {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0"
  };

  res.status(200).json(health);
}

// For static hosting, create a JSON file instead
// This is a fallback for static hosting

