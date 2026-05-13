#!/usr/bin/env node

/**
 * Bundle size analysis script
 * Run after build to check bundle sizes
 */

const { readdirSync, statSync } = require("fs");
const { join } = require("path");
const distPath = join(__dirname, "../dist");

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getFileSize(filePath) {
  try {
    const stats = statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function analyzeBundle() {
  console.log("📦 Bundle Size Analysis\n");
  console.log("=".repeat(50));

  const assetsPath = join(distPath, "assets");
  const files = [
    "index.html",
    join("assets", "index-*.js"),
    join("assets", "index-*.css")
  ];

  let totalSize = 0;

  // Check main files
  try {
    const indexHtml = join(distPath, "index.html");
    const htmlSize = getFileSize(indexHtml);
    totalSize += htmlSize;
    console.log(`📄 index.html: ${formatBytes(htmlSize)}`);
  } catch (err) {
    console.log("⚠️  index.html not found");
  }

  // Check JS chunks
  try {
    const assets = readdirSync(assetsPath);
    const jsFiles = assets.filter((f) => f.endsWith(".js"));
    const cssFiles = assets.filter((f) => f.endsWith(".css"));

    console.log("\n📦 JavaScript Chunks:");
    for (const file of jsFiles) {
      const filePath = join(assetsPath, file);
      const size = getFileSize(filePath);
      totalSize += size;
      console.log(`   ${file}: ${formatBytes(size)}`);
    }

    console.log("\n🎨 CSS Files:");
    for (const file of cssFiles) {
      const filePath = join(assetsPath, file);
      const size = getFileSize(filePath);
      totalSize += size;
      console.log(`   ${file}: ${formatBytes(size)}`);
    }
  } catch (err) {
    console.log("⚠️  Assets directory not found. Run 'npm run build' first.");
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Total Size: ${formatBytes(totalSize)}`);

  // Recommendations
  if (totalSize > 500000) {
    console.log("\n⚠️  Bundle size is large (>500KB). Consider:");
    console.log("   - Further code splitting");
    console.log("   - Tree-shaking unused dependencies");
    console.log("   - Lazy loading more components");
  } else {
    console.log("\n✅ Bundle size is optimized!");
  }
}

analyzeBundle();

