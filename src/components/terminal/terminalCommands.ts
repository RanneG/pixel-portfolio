/**
 * Portfolio terminal command router.
 */
import type { PortfolioData, WorkExperienceEntry, Project } from "../../types";
import { wrapText } from "../../utils/wrapText";
import { parseCli } from "./terminalCommandParser";

export type CommandOutcome =
  | { type: "output"; lines: string[]; openUrl?: string }
  | { type: "clear" };

/** Commands shown in help and used for Tab completion (order = help text order). */
export const KNOWN_COMMANDS = [
  "help",
  "about",
  "experience",
  "education",
  "skills",
  "contact",
  "open",
  "projects",
  "clear",
] as const;

const WRAP = 72;

function stripBioLine(line: string): string {
  return line.replace(/^\s*>\s*/, "").trim();
}

function pushWrappedSection(lines: string[], heading: string, body: string) {
  const rule = "-".repeat(Math.min(Math.max(heading.length, 3), 56));
  lines.push(heading, rule, "");
  lines.push(...wrapText(body, WRAP).map((l) => `  ${l}`));
  lines.push("");
}

/** CV-to-evidence narrative; shown when running `skills --skill` (optional topic filter). */
const SKILLS_CV_EVIDENCE: { heading: string; body: string }[] = [
  {
    heading: "CONSULTING & BUSINESS / CLIENT-FACING / COMMUNICATION",
    body:
      "DWP (reports, visualisations, data practices) and Dome (team, suppliers, sales rhythm) are classic stakeholder and operational work for me. Cantium help desk is high-volume client-facing with clear SLAs and documentation habits (ITSM, onboarding kits). Deloitte meant client delivery under structure (Agile, SOPs, runbooks). Projects (Stitch, Lucky Charm) show me translating fuzzy product ideas into trust boundaries (local-first, privacy copy, wallet/TEE framing)—consulting-adjacent product judgment, not only tickets.",
  },
  {
    heading: "CLOUD SERVICES / DEVOPS & CONTAINERS",
    body:
      "Deloitte is my anchor: AWS, Terraform, Docker, Kubernetes, Jenkins, multi-region and ACM-style thinking, Python and Java in pipelines—the “two months to one day” story is platform engineering and process improvement in one package. Side work (Stitch Flask bridge, deployable RAG) shows I can own service-shaped pieces even when the headline is “app.”",
  },
  {
    heading: "PROGRAMMING & SCRIPTING LANGUAGES",
    body:
      "Greenstone / Katalyze: Python, SQL, Bash, SAS—data and automation scripting. Product stack: TypeScript, React, Tauri/Vite where Stitch is concerned; Python for APIs and RAG. I aim to be a polyglot with intent: TypeScript for UX and typed frontends, Python for glue, data, and ML-style backends.",
  },
  {
    heading: "NETWORKING",
    body:
      "Cantium explicitly: Wi-Fi, LAN, DHCP, DNS, VoIP—real L2–L4 troubleshooting, not just “I know TCP/IP.” That depth supports reliability and debugging when things break in production or on user machines.",
  },
  {
    heading: "GAME DEVELOPMENT",
    body:
      "My portfolio and retro history are more game-inspired UX (terminal, gamified metaphors) than shipping AAA gameplay. Honest framing: interactive UI and playful systems design, optionally game jams—unless I ship game titles, I keep this as adjacent craft, not core identity.",
  },
  {
    heading: "PROJECT COORDINATION / ADAPTABILITY / PROCESS IMPROVEMENT",
    body:
      "Dome (scheduling, team), Deloitte (SOPs, repeatable deploys), Cantium (standard kits, ITSM)—same theme: make chaos repeatable. Encode / hackathon wins (e.g. Autonomi, Lucky Charm narrative) show I can compress scope and ship under time pressure.",
  },
  {
    heading: "AI (OPENCLAW, LOCAL LLMS)",
    body:
      "Projects plus MCP, Ollama, and LlamaIndex are how I integrate models into products and tools (RAG, MCP server, editor-side workflows), not just ChatGPT in a browser. OpenClaw is orchestration and agent-host curiosity alongside local LLMs—where intelligence lives and what the risk boundary is—a senior angle in 2026 hiring when articulated clearly.",
  },
];

function filterCvEvidenceSections(topicNeedle: string): { heading: string; body: string }[] {
  const q = topicNeedle.toLowerCase().trim();
  if (!q) return [...SKILLS_CV_EVIDENCE];
  return SKILLS_CV_EVIDENCE.filter(
    (s) => s.heading.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
  );
}

function appendCvEvidenceBlock(lines: string[], sections: { heading: string; body: string }[]) {
  lines.push(
    "CV → EVIDENCE (mapping résumé lines to proof)",
    "==============================================",
    ""
  );
  for (const sec of sections) {
    pushWrappedSection(lines, sec.heading, sec.body);
  }
}

export function githubProfileUrl(data: PortfolioData): string {
  const g = data.socialLinks.find((l) => l.name.toUpperCase() === "GITHUB");
  return g?.url ?? "https://github.com/RanneG";
}

export function linkedinProfileUrl(data: PortfolioData): string {
  const l = data.socialLinks.find((x) => x.name.toUpperCase() === "LINKEDIN");
  return l?.url ?? "https://www.linkedin.com/in/ranne-gerodias-809460108/";
}

function projectMatches(p: Project, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return false;
  const t = p.title.toLowerCase();
  if (t.includes(q)) return true;
  const gh = (p.githubUrl ?? "").toLowerCase();
  if (gh) {
    if (gh.includes(q)) return true;
    const last = gh.split("/").filter(Boolean).pop()?.replace(/\.git$/, "") ?? "";
    if (last && (last === q || last.includes(q) || q.includes(last))) return true;
  }
  const tokens = q.split(/[\s/_.-]+/).filter((x) => x.length >= 2);
  for (const tok of tokens) {
    if (t.includes(tok)) return true;
    if (gh.includes(tok)) return true;
  }
  return false;
}

function primaryProjectUrl(p: Project): string | null {
  const live = p.liveUrl?.trim();
  const gh = p.githubUrl?.trim();
  return live || gh || null;
}

function sanitizeHttpUrl(raw: string): string | null {
  const s = raw.trim();
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

function tipOpenProjectPhrase(query: string): string {
  const safe = query.replace(/"/g, "'");
  return `Tip: open --project "${safe}" opens the primary link in a new tab.`;
}

function tipOpenCompanyPhrase(companyFilter: string): string {
  const safe = companyFilter.replace(/"/g, "'");
  return `Tip: open --company "${safe}" opens the company site in a new tab.`;
}

function cmdHelpOpen(): string[] {
  return [
    "Use only one target per command. Same quoted strings as experience where noted.",
    "",
    "  open --github",
    "    Opens your GitHub profile URL from contact / social data.",
    "",
    "  open --profile",
    "    Opens your LinkedIn profile URL from contact / social data.",
    "",
    "  open profile   (or: open linkedin)",
    "    Same as --profile — shorthand without double dashes.",
    "",
    "  open github",
    "    Same as --github — shorthand.",
    "",
    "  open --project \"Name\"",
    "    Same matching as experience --project. Opens live site if set, else repo URL.",
    "",
    "  open --company \"Substring\"",
    "    Same filter as experience --company. Opens optional employer `url` from",
    "    personal.json when exactly one role matches and has a URL.",
    "",
    "  open --url \"https://…\"",
    "    Opens an arbitrary http(s) URL (other schemes are rejected).",
    "",
    "Example:  experience --company \"Deloitte\"  then  open --company \"Deloitte\"",
  ];
}

function cmdHelpCommandSummaries(): string[] {
  return [
    "about      — Name, role, location, motto, short bio",
    "experience — Work history (see: help experience)",
    "education  — Degrees and institutions from portfolio data",
    "skills     — CV-shaped skill categories; --lang / --skill for filters + narrative (help skills)",
    "contact    — Email, location, social links;  contact --send  starts an interactive message",
    "open       — Open links in a new tab (see: help open)",
    "projects   — Project names + where to read more",
    "clear      — Clear this tab’s transcript",
    "help       — This list, or help <command> for flags",
  ];
}

/** Main `help` with context and pointers to per-command help. */
function cmdHelpOverview(): string[] {
  const topics = ["about", "clear", "contact", "education", "experience", "help", "open", "projects", "skills"];
  return [
    "",
    "PORTFOLIO TERMINAL",
    "==================",
    "",
    "Type a command after the $ prompt, then Enter.",
    "Use double quotes when a value has spaces, e.g. experience --company \"Deloitte\".",
    "Press Tab to complete a command name from the first word on the line.",
    "",
    "Commands",
    "--------",
    ...cmdHelpCommandSummaries().map((l) => `  ${l}`),
    "",
    "More detail for one command (flags and examples):",
    `  help <command>     e.g.  help experience   or   help open`,
    "",
    `Topics: ${topics.join(", ")}`,
    "",
  ];
}

/** `help <topic>` — returns null if topic is not documented. */
function cmdHelpTopic(topic: string): string[] | null {
  switch (topic) {
    case "help":
      return [
        "",
        "help",
        "----",
        "",
        "  help",
        "    Show the main command list and how to use the terminal.",
        "",
        "  help <command>",
        "    Show flags, behaviour, and examples for that command only.",
        "    Example:  help experience",
        "",
      ];

    case "about":
      return [
        "",
        "about",
        "-----",
        "",
        "  about",
        "    Prints name, location, motto, role summary (wrapped), and bio lines from portfolio data.",
        "    No flags.",
        "",
      ];

    case "clear":
      return [
        "",
        "clear",
        "-----",
        "",
        "  clear",
        "    Clears the transcript in the current tab (scrollback) and shows the welcome",
        "    message again. Command history for ↑/↓ is kept.",
        "    No flags.",
        "",
      ];

    case "contact":
      return [
        "",
        "contact",
        "-------",
        "",
        "  contact",
        "    Prints email, location, timezone, and each social link from portfolio data.",
        "",
        "  contact --send",
        "    Starts a short prompt flow in this terminal: name, then email, then message",
        "    (one line each). Submits via Formspree when the message validates.",
        "    Type cancel or abort during the flow to quit without sending.",
        "",
      ];

    case "projects":
      return [
        "",
        "projects",
        "--------",
        "",
        "  projects",
        "    Lists project titles, then pointers to GitHub and related tooling context.",
        "    No flags.",
        "    For full write-up on one build:  experience --project \"Name\"",
        "",
      ];

    case "education":
      return [
        "",
        "education",
        "---------",
        "",
        "  education",
        "    Lists each qualification with dates and institution from public/data/personal.json.",
        "    No flags.",
        "",
      ];

    case "experience":
      return [
        "",
        "experience",
        "----------",
        "",
        "Only one of the branches below runs; they are checked in this order:",
        "",
        "  experience --project \"Name\"",
        "    One project: motivation, tools, links. \"Name\" matches title or GitHub path",
        "    (e.g. standup-bot). If several match, narrow the string.",
        "",
        "  experience --company \"Substring\"",
        "    Employers whose company field contains the substring (case-insensitive).",
        "    Full paragraphs for each match.",
        "",
        "  experience --detailed",
        "    Full work history for every role (paragraphs when present).",
        "",
        "  experience",
        "    Short summary: count of roles and one line per employer.",
        "",
        "Pair with open: same quoted string for company/project, or open --github / open --profile.",
        "",
      ];

    case "skills":
      return [
        "",
        "skills",
        "------",
        "",
        "  skills",
        "    Lists each category and concrete skills from public/data/skills.json (CV- and",
        "    project-shaped, not a generic template).",
        "",
        "  skills --lang <needle>",
        "    Case-insensitive substring across all categories, with levels, e.g.:",
        "      skills --lang python",
        "      skills --lang react",
        "",
        "  skills --skill",
        "    Same category list, then the full CV-to-evidence narrative (how roles map",
        "    to consulting, cloud, languages, networking, process, and AI).",
        "",
        "  skills --skill <topic>",
        "    Same list, then only narrative sections whose heading or body contains the",
        "    substring (case-insensitive). Examples:",
        "      skills --skill cloud",
        "      skills --skill \"game\"",
        "",
        "Note: --lang is evaluated first; if you pass both, only --lang output runs.",
        "",
      ];

    case "open":
      return ["", "open — links in a new tab", "------------------------", ...cmdHelpOpen(), ""];

    default:
      return null;
  }
}

function cmdAbout(data: PortfolioData): string[] {
  const motto = data.motto?.trim() || data.subtitle;
  const lines: string[] = [
    "",
    `NAME:       ${data.name}`,
    `LOCATION:   ${data.contact.location}`,
    `MOTTO:      "${motto}"`,
    "",
    "ROLE & FOCUS",
    "--------------",
    ...wrapText(data.title.trim(), WRAP).map((l) => `  ${l}`),
    "",
  ];
  const bioParas = data.bio.map(stripBioLine).filter(Boolean);
  if (bioParas.length > 0) {
    lines.push("MORE", "----", "");
    for (const para of bioParas) {
      lines.push(...wrapText(para, WRAP).map((l) => `  ${l}`));
      lines.push("");
    }
    if (lines[lines.length - 1] === "") lines.pop();
  }
  lines.push("");
  return lines;
}

function filterWork(
  entries: WorkExperienceEntry[] | undefined,
  companySub: string
): WorkExperienceEntry[] {
  if (!entries?.length) return [];
  const q = companySub.toLowerCase();
  return entries.filter((e) => e.company.toLowerCase().includes(q));
}

function formatWorkEntry(e: WorkExperienceEntry, detailed: boolean): string[] {
  const span = `${e.start}–${e.end}`;
  const out = [`${span}  ${e.role} @ ${e.company}`];
  if (!detailed) return out;

  if (e.paragraphs?.length) {
    out.push("");
    for (const para of e.paragraphs) {
      out.push(...wrapText(para, WRAP).map((l) => `  ${l}`));
      out.push("");
    }
    if (out[out.length - 1] === "") out.pop();
    return out;
  }

  if (e.bullets?.length) {
    for (const b of e.bullets) {
      out.push(`              - ${b}`);
    }
  }
  return out;
}

function cmdExperienceProject(data: PortfolioData, query: string): string[] {
  const matched = data.projects.filter((p) => projectMatches(p, query));
  if (matched.length === 0) {
    return [
      `No project matches "${query}".`,
      "Try 'projects' for names, or match part of the title / GitHub repo slug (e.g. standup-bot).",
    ];
  }
  if (matched.length > 1) {
    return [
      `Multiple projects match "${query}":`,
      ...matched.map((p) => `  - ${p.title}`),
      "",
      'Refine with a longer substring, e.g. experience --project "Lucky"',
    ];
  }
  const p = matched[0]!;
  const motivation = (p.motivation ?? p.description).trim();
  const lines: string[] = [
    "",
    `PROJECT:    ${p.title}`,
    `STATUS:     ${p.status}`,
    "",
    "WHY / MOTIVATION",
    "-----------------",
    ...wrapText(motivation, WRAP).map((l) => `  ${l}`),
    "",
    "TOOLS",
    "-----",
    `  ${p.tech.join(", ")}`,
  ];
  if (p.award?.trim()) {
    lines.push("", "AWARD", "---------", `  ${p.award.trim()}`);
  }
  if (p.highlight?.trim()) {
    lines.push("", "HIGHLIGHT", "---------", `  ${p.highlight.trim()}`);
  }
  lines.push("", "LINKS", "-----");
  if (p.githubUrl) lines.push(`  GitHub: ${p.githubUrl}`);
  if (p.liveUrl) lines.push(`  Live:   ${p.liveUrl}`);
  if (!p.githubUrl && !p.liveUrl) lines.push("  (no URLs on file)");
  lines.push("");
  if (primaryProjectUrl(p)) {
    lines.push(tipOpenProjectPhrase(query));
    lines.push("");
  }
  return lines;
}

function cmdExperience(data: PortfolioData, flags: Record<string, string | boolean>): string[] {
  const entries = data.workExperience ?? [];
  const detailed = flags.detailed === true || flags.detailed === "true";
  const projectArg = flags.project;
  const projectQuery =
    typeof projectArg === "string" ? projectArg.trim() : typeof projectArg === "boolean" ? "" : "";
  if (projectQuery) {
    return cmdExperienceProject(data, projectQuery);
  }

  const companyArg = flags.company;
  const companyFilter =
    typeof companyArg === "string" ? companyArg : typeof companyArg === "boolean" ? "" : "";

  if (companyFilter) {
    const matched = filterWork(entries, companyFilter);
    if (matched.length === 0) {
      return [`No work entries matching company "${companyFilter}".`];
    }
    const lines: string[] = ["", "WORK EXPERIENCE (filtered)", "----------------"];
    for (const e of matched) {
      lines.push(...formatWorkEntry(e, true));
      lines.push("");
    }
    if (matched.length === 1 && matched[0]!.url?.trim()) {
      lines.push(tipOpenCompanyPhrase(companyFilter));
      lines.push("");
    }
    return lines;
  }

  if (detailed) {
    if (entries.length === 0) {
      return [
        "",
        "No structured work history yet. Add `workExperience` to public/data/personal.json.",
        "",
      ];
    }
    const lines: string[] = ["", "WORK EXPERIENCE", "----------------"];
    for (const e of entries) {
      lines.push(...formatWorkEntry(e, true));
      lines.push("");
    }
    return lines;
  }

  const lines: string[] = ["", `Roles on file: ${entries.length}`];
  if (entries.length > 0) {
    lines.push("", "Summary:");
    for (const e of entries) {
      lines.push(`  ${e.start}–${e.end}  ${e.role} @ ${e.company}`);
    }
    lines.push(
      "",
      "Try: experience --detailed   or   experience --company \"…\"   or   experience --project \"…\""
    );
  } else {
    lines.push(
      "",
      "Try: experience --detailed (after you add workExperience to personal.json), or experience --project \"…\"."
    );
  }
  return lines;
}

function cmdOpen(
  data: PortfolioData,
  flags: Record<string, string | boolean>,
  positionals: string[]
): CommandOutcome {
  const urlRaw = flags.url;
  const projectRaw = flags.project;
  const companyRaw = flags.company;
  const urlStr = typeof urlRaw === "string" ? urlRaw.trim() : "";
  const projectStr = typeof projectRaw === "string" ? projectRaw.trim() : "";
  const companyStr = typeof companyRaw === "string" ? companyRaw.trim() : "";
  const wantGithub = flags.github === true || flags.github === "true";
  const wantLinkedin = flags.profile === true || flags.profile === "true";

  const p0 = positionals[0]?.toLowerCase() ?? "";
  const githubPos = p0 === "github";
  const linkedinPos = p0 === "profile" || p0 === "linkedin";

  const modeGithub = wantGithub || githubPos;
  const modeLinkedin = wantLinkedin || linkedinPos;

  const modes = [
    urlStr ? "url" : null,
    projectStr ? "project" : null,
    companyStr ? "company" : null,
    modeGithub ? "github" : null,
    modeLinkedin ? "linkedin" : null,
  ].filter(Boolean) as string[];

  if (modes.length > 1) {
    return {
      type: "output",
      lines: [
        "",
        "Use only one of: --url, --project, --company, --github, --profile",
        "(or shorthand: open github | open profile | open linkedin).",
        "",
      ],
    };
  }
  if (modes.length === 0) {
    const hint =
      positionals.length > 0
        ? `Unknown "${positionals[0]}". Try: help open`
        : "Try: help open";
    return { type: "output", lines: ["", hint, ""] };
  }

  if (modeGithub) {
    const url = githubProfileUrl(data);
    return {
      type: "output",
      lines: ["", `Opening GitHub…`, `  ${url}`, ""],
      openUrl: url,
    };
  }

  if (modeLinkedin) {
    const url = linkedinProfileUrl(data);
    return {
      type: "output",
      lines: ["", `Opening LinkedIn…`, `  ${url}`, ""],
      openUrl: url,
    };
  }

  if (urlStr) {
    const safe = sanitizeHttpUrl(urlStr);
    if (!safe) {
      return {
        type: "output",
        lines: ["", "Only http:// or https:// URLs are allowed.", ""],
      };
    }
    return {
      type: "output",
      lines: ["", `Opening…`, `  ${safe}`, ""],
      openUrl: safe,
    };
  }

  if (projectStr) {
    const matched = data.projects.filter((p) => projectMatches(p, projectStr));
    if (matched.length === 0) {
      return {
        type: "output",
        lines: ["", `No project matches "${projectStr}".`, ""],
      };
    }
    if (matched.length > 1) {
      return {
        type: "output",
        lines: [
          "",
          `Multiple projects match "${projectStr}":`,
          ...matched.map((p) => `  - ${p.title}`),
          "",
          "Refine the name, then run open again.",
          "",
        ],
      };
    }
    const p = matched[0]!;
    const url = primaryProjectUrl(p);
    if (!url) {
      return {
        type: "output",
        lines: ["", `No live or GitHub URL on file for ${p.title}.`, ""],
      };
    }
    return {
      type: "output",
      lines: ["", `Opening ${p.title}…`, `  ${url}`, ""],
      openUrl: url,
    };
  }

  const matched = filterWork(data.workExperience, companyStr);
  if (matched.length === 0) {
    return {
      type: "output",
      lines: ["", `No work entries matching company "${companyStr}".`, ""],
    };
  }
  if (matched.length > 1) {
    return {
      type: "output",
      lines: [
        "",
        `Multiple companies match "${companyStr}":`,
        ...matched.map((e) => `  - ${e.company}`),
        "",
        "Refine the filter, then run open again.",
        "",
      ],
    };
  }
  const e = matched[0]!;
  const url = e.url?.trim();
  if (!url) {
    return {
      type: "output",
      lines: [
        "",
        `No company URL on file for ${e.company}.`,
        "Add optional `url` on that role in public/data/personal.json.",
        "",
      ],
    };
  }
  const safe = sanitizeHttpUrl(url);
  if (!safe) {
    return {
      type: "output",
      lines: ["", "Stored company `url` must be http:// or https://.", ""],
    };
  }
  return {
    type: "output",
    lines: ["", `Opening ${e.company}…`, `  ${safe}`, ""],
    openUrl: safe,
  };
}

function cmdSkills(data: PortfolioData, flags: Record<string, string | boolean>): string[] {
  const langRaw = flags.lang;
  const needle = typeof langRaw === "string" ? langRaw.toLowerCase().trim() : "";

  if (needle) {
    const lines: string[] = ["", `Skills matching "${needle}":`, ""];
    let any = false;
    for (const cat of data.skills) {
      const hits = cat.skills.filter((sk) => sk.name.toLowerCase().includes(needle));
      if (hits.length > 0) {
        any = true;
        lines.push(`${cat.title}: ${hits.map((h) => `${h.name} (${h.level})`).join(", ")}`);
      }
    }
    if (!any) {
      lines.push("(no matches)");
    }
    lines.push("");
    return lines;
  }

  const lines: string[] = ["", "SKILLS", "------", ""];
  const titleCol = Math.max(12, ...data.skills.map((c) => c.title.length));
  for (const cat of data.skills) {
    const names = cat.skills.map((s) => s.name).join(", ");
    lines.push(`${cat.title.padEnd(titleCol)} ${names}`);
  }
  lines.push(
    "",
    "Try:  skills --lang python",
    "       skills --skill           (append full CV-to-evidence narrative)",
    '       skills --skill cloud     (narrative sections matching substring)',
    ""
  );

  const skillRaw = flags.skill;
  if (skillRaw !== undefined && skillRaw !== false) {
    const skillTopic = typeof skillRaw === "string" ? skillRaw.trim() : "";
    const showAllNarrative =
      skillRaw === true || skillRaw === "true" || skillTopic.length === 0;

    const sections = showAllNarrative
      ? [...SKILLS_CV_EVIDENCE]
      : filterCvEvidenceSections(skillTopic);

    if (sections.length === 0) {
      lines.push(
        `No CV evidence section matches "${skillTopic}".`,
        "",
        "Hint: try consulting, cloud, programming, networking, game, process, AI, openclaw…",
        ""
      );
      return lines;
    }

    appendCvEvidenceBlock(lines, sections);
    if (lines[lines.length - 1] === "") lines.pop();
    lines.push("");
    return lines;
  }

  if (lines[lines.length - 1] === "") lines.pop();
  lines.push("");
  return lines;
}

function cmdEducation(data: PortfolioData): string[] {
  const entries = data.education ?? [];
  const lines: string[] = ["", "EDUCATION", "-----------", ""];
  if (entries.length === 0) {
    lines.push("  (none on file — add an `education` array in public/data/personal.json.)", "");
    return lines;
  }
  for (const e of entries) {
    const span = `${e.start}–${e.end}`;
    const where = [e.institution, e.location].filter(Boolean).join(", ");
    lines.push(`  ${span}  ${e.qualification}`);
    lines.push(`           ${where}`);
    lines.push("");
  }
  if (lines[lines.length - 1] === "") lines.pop();
  lines.push("");
  return lines;
}

function cmdContact(data: PortfolioData): string[] {
  const lines: string[] = [
    "",
    `EMAIL:      ${data.contact.email}`,
    `LOCATION:   ${data.contact.location}`,
    `TIMEZONE:   ${data.contact.timezone}`,
    "",
  ];
  for (const link of data.socialLinks) {
    lines.push(`${link.name.padEnd(12)} ${link.url}`);
  }
  if (data.availableForHire) {
    lines.push(
      "",
      "Status: full-time employed; open to scoped freelance or consulting by arrangement (not replacing day job)."
    );
  }
  lines.push("", "Tip: in the portfolio terminal, run  contact --send  for an interactive message.", "");
  return lines;
}

function cmdProjects(data: PortfolioData): string[] {
  const gh = githubProfileUrl(data);
  const lines: string[] = ["", "PROJECTS", "----------", ""];
  for (const p of data.projects) {
    lines.push(`  ${p.title}`);
  }
  lines.push(
    "",
    "Repositories and depth:",
    `  ${gh}`,
    "",
    "Also in the mix: Ollama for local models, Linkup MCP + RanneG/linkup_mcp for Cursor-side search/RAG,",
    "and OpenClaw on a dedicated Mac for agent-style workflows outside this portfolio.",
    ""
  );
  if (data.projects.some((p) => p.questId === "CB-001")) {
    lines.push(
      "CHATBOT RAG CORE: live Groq persona demo (three voices, streaming) — Browse → Projects. Dev: GROQ_API_KEY in .env.local + npm run dev.",
      ""
    );
  }
  lines.push('For motivation + stack on one build: experience --project "Name"', "");
  return lines;
}

export function runTerminalCommand(input: string, data: PortfolioData): CommandOutcome {
  const trimmed = input.trim();
  if (!trimmed) {
    return { type: "output", lines: [] };
  }

  const { command, flags, positionals } = parseCli(trimmed);

  switch (command) {
    case "help": {
      const topic = positionals[0]?.toLowerCase();
      if (topic) {
        const detail = cmdHelpTopic(topic);
        if (detail) {
          return { type: "output", lines: detail };
        }
        const known = ["about", "clear", "contact", "education", "experience", "help", "open", "projects", "skills"];
        return {
          type: "output",
          lines: [
            "",
            `No help topic "${positionals[0]}".`,
            "",
            `Try:  help <command>   where command is one of:`,
            `  ${known.join(", ")}`,
            "",
          ],
        };
      }
      return { type: "output", lines: cmdHelpOverview() };
    }

    case "about":
      return { type: "output", lines: cmdAbout(data) };

    case "experience":
      return { type: "output", lines: cmdExperience(data, flags) };

    case "education":
      return { type: "output", lines: cmdEducation(data) };

    case "skills":
      return { type: "output", lines: cmdSkills(data, flags) };

    case "contact":
      return { type: "output", lines: cmdContact(data) };

    case "open":
      return cmdOpen(data, flags, positionals);

    case "projects":
      return { type: "output", lines: cmdProjects(data) };

    case "clear":
      return { type: "clear" };

    case "echo":
      return { type: "output", lines: [positionals.join(" ") || ""] };

    default: {
      const token0 = trimmed.split(/\s+/)[0] ?? "?";
      return {
        type: "output",
        lines: [`Command not found: ${command || token0}. Type 'help'.`],
      };
    }
  }
}

/** Tab completion: longest common prefix of commands starting with `prefix`. */
export function completeCommandPrefix(prefix: string): string | null {
  const p = prefix.trim().toLowerCase();
  if (!p) return null;
  const matches = KNOWN_COMMANDS.filter((c) => c.startsWith(p));
  if (matches.length === 0) return null;
  if (matches.length === 1) return `${matches[0]} `;
  const first = matches[0]!;
  let i = p.length;
  while (i < first.length) {
    const ch = first[i];
    if (matches.every((m) => m[i] === ch)) i++;
    else break;
  }
  const extended = first.slice(0, i);
  if (extended === p) return null;
  return extended;
}
