#!/usr/bin/env node

/**
 * Automated changelog updater
 * Generates changelog entries from git commits
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getGitCommits(since) {
  try {
    const format = "%H|%s|%an|%ad";
    const dateFormat = "--date=short";
    const command = `git log --pretty=format:"${format}" ${dateFormat} ${since ? `--since="${since}"` : ""}`;
    const output = execSync(command, { encoding: "utf-8" });
    return output
      .trim()
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [hash, subject, author, date] = line.split("|");
        return { hash, subject, author, date };
      });
  } catch {
    return [];
  }
}

function categorizeCommit(subject) {
  const lower = subject.toLowerCase();
  if (lower.startsWith("feat:")) return "Added";
  if (lower.startsWith("fix:")) return "Fixed";
  if (lower.startsWith("docs:")) return "Documentation";
  if (lower.startsWith("style:")) return "Style";
  if (lower.startsWith("refactor:")) return "Refactored";
  if (lower.startsWith("perf:")) return "Performance";
  if (lower.startsWith("test:")) return "Tests";
  if (lower.startsWith("chore:")) return "Chore";
  return "Changed";
}

function generateChangelogEntry(commits) {
  if (commits.length === 0) return "";

  const categories = {};
  commits.forEach((commit) => {
    const category = categorizeCommit(commit.subject);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(commit);
  });

  const today = new Date().toISOString().split("T")[0];
  let entry = `## [Unreleased] - ${today}\n\n`;

  Object.keys(categories)
    .sort()
    .forEach((category) => {
      entry += `### ${category}\n\n`;
      categories[category].forEach((commit) => {
        const description = commit.subject.replace(/^(feat|fix|docs|style|refactor|perf|test|chore):\s*/i, "");
        entry += `- ${description} (${commit.hash.substring(0, 7)})\n`;
      });
      entry += "\n";
    });

  return entry;
}

function updateChangelog() {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");
  let changelog = "";

  if (fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, "utf-8");
  } else {
    changelog = "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n";
  }

  // Get commits since last release (or all if no releases)
  const lastReleaseMatch = changelog.match(/## \[([^\]]+)\]/);
  const since = lastReleaseMatch ? null : null; // Could parse date from release

  const commits = getGitCommits(since);
  const newEntry = generateChangelogEntry(commits);

  if (newEntry) {
    // Insert after "# Changelog" or at the beginning
    const insertPoint = changelog.indexOf("##");
    if (insertPoint > 0) {
      changelog = changelog.slice(0, insertPoint) + newEntry + changelog.slice(insertPoint);
    } else {
      changelog = changelog + "\n" + newEntry;
    }

    fs.writeFileSync(changelogPath, changelog);
    console.log("✅ Changelog updated");
  } else {
    console.log("ℹ️  No new commits to add to changelog");
  }
}

if (require.main === module) {
  updateChangelog();
}

module.exports = { updateChangelog };

