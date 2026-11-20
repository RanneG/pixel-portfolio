export type ProjectStatus =
  | "In progress"
  | "Live"
  | "Live demo"
  | "Early access"
  | "Shipped";

export type Project = {
  slug: string;
  title: string;
  /** Short label for the kind of thing it is, shown in the project list. */
  kind: string;
  status: ProjectStatus;
  year: string;
  tagline: string;
  description: string;
  highlights?: string[];
  award?: string;
  stack: string[];
  links: {
    live?: string;
    source?: string;
  };
  /** Shown in place of a source link, for example when the repository is private. */
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "stitch",
    title: "Stitch",
    kind: "Desktop app",
    status: "In progress",
    year: "2026",
    tagline: "Own your subscription data, and search it locally.",
    description:
      "A local-first subscription companion. A Tauri and React desktop app talks to a Python bridge that runs RAG over your own PDFs, so documents and Gmail context stay on your machine instead of in another SaaS dashboard.",
    highlights: [
      "Google sign-in with Gmail discovery of your subscriptions",
      "Ask questions of your own PDFs through a local RAG bridge",
      "Optional face verification as a second factor",
    ],
    stack: [
      "Tauri",
      "React",
      "TypeScript",
      "Python",
      "Flask",
      "RAG",
      "Google OAuth",
    ],
    links: { source: "https://github.com/RanneG/stitch-app" },
  },
  {
    slug: "linkup-mcp",
    title: "Linkup MCP",
    kind: "MCP server",
    status: "In progress",
    year: "2026",
    tagline: "AI assistance that stays on your machine, in your editor.",
    description:
      "A custom MCP server for Cursor. It pairs Linkup web search with local RAG over your documents using LlamaIndex and Ollama, so answers come from your own files without sending them to a cloud chat UI. It also runs the HTTP bridge behind Stitch.",
    highlights: [
      "RAG over PDF, DOCX and Markdown, with source citations",
      "Runs on local models through Ollama, with no API cost",
      "Offline voice-to-prompt dictation using local Whisper",
    ],
    stack: ["Python", "MCP", "LlamaIndex", "Ollama", "Flask"],
    links: { source: "https://github.com/RanneG/linkup_mcp" },
  },
  {
    slug: "jibbynails-booking",
    title: "Jibbynails Booking",
    kind: "Booking app",
    status: "Live",
    year: "2026",
    tagline: "Appointments booked from a phone, managed from one diary.",
    description:
      "A phone-first booking app for Jibbynails in Strood. Clients book from their phone, and the owner manages bookings and private notes from a separate manager view. Hosted on Fly.io in London.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Docker", "Fly.io"],
    links: { live: "https://www.jibbylovesnails.co.uk" },
  },
  {
    slug: "industrial-compliance-system",
    title: "Industrial Compliance System",
    kind: "Web app",
    status: "Live demo",
    year: "2026",
    tagline: "A site permit to work, as a five-part digital flow.",
    description:
      "A Permit to Work demo for endoscopy decontamination equipment. The five parts follow a site permit: user checks, CP(D) declaration, hand-back, user review and AP(D) close.",
    highlights: [
      "Engineers open a permit from its QR code or link, with no login",
      "Public evaluation build running on sample data",
      "Ships as a single Docker image, with a pytest suite",
    ],
    stack: ["React", "TypeScript", "Vite", "Python", "FastAPI", "Docker"],
    links: {
      live: "https://ics-compliance.onrender.com",
      source: "https://github.com/RanneG/compliance-system",
    },
  },
  {
    slug: "supplyme",
    title: "SUPPLYME",
    kind: "AI agent",
    status: "Early access",
    year: "2026",
    tagline: "A desk for every job, and one focus for the week.",
    description:
      "A long-running personal business agent for founders juggling parallel workstreams. It captures incoming email, messages and website forms, routes each one to the right Telegram topic chat, and helps decide what to focus on each week.",
    highlights: [
      "Classifies inbound messages by workstream and urgency",
      "Weekly focus: one primary priority and a park list",
      "Each customer runs as an isolated tenant with its own bot, group and sheet",
    ],
    stack: ["Hermes Agent", "Telegram", "Google Sheets", "Python"],
    links: {
      live: "https://ranneg.github.io/supplyme-site/",
      source: "https://github.com/RanneG/supplyme-crew",
    },
  },
  {
    slug: "koshi-chhyang",
    title: "Koshi Chhyang",
    kind: "Brand website",
    status: "Live",
    year: "2026",
    tagline: "A Nepalese rice wine brand, from the Koshi hills to the table.",
    description:
      "The website for Koshi Chhyang, small-batch Nepalese rice wine brewed in Kent. It tells the heritage story, previews the collection, and takes waiting-list sign-ups and trade enquiries.",
    highlights: [
      "Static HTML with a scripted build and image optimisation",
      "Waiting list and trade enquiry forms",
      "Deployed to GitHub Pages from GitHub Actions",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Python", "GitHub Actions"],
    links: {
      live: "https://www.koshichhyang.com/",
      source: "https://github.com/RanneG/koshi-chhyang-site",
    },
  },
  {
    slug: "lucky-charm",
    title: "Lucky Charm",
    kind: "Privacy tool",
    status: "Shipped",
    year: "2026",
    tagline: "Standup signal without leaking the transcript.",
    description:
      "A privacy-preserving standup and meeting-transcript tool. Wallet-first sign-in, TEE-oriented processing and filtered dashboards give teams structured themes and actions, without verbatim quotes leaving the trust boundary.",
    award: "Encode Club hackathon winner",
    stack: ["React", "Vite", "Wallet auth", "TEE", "Flask"],
    links: {
      live: "https://lucky-charm-taupe.vercel.app/",
      source: "https://github.com/RanneG/standup-bot",
    },
  },
  {
    slug: "autonomi",
    title: "Autonomi",
    kind: "DeFi",
    status: "Shipped",
    year: "2026",
    tagline: "A 24/7 bodyguard for lending positions.",
    description:
      "Autonomous lending protection on Arc, built for an Encode hackathon. It watches a USYC/USDC position and rebalances automatically when loan-to-value crosses the safety threshold, so volatility doesn't end in a surprise liquidation.",
    stack: ["TypeScript", "DeFi", "Arc", "USYC / USDC"],
    links: {
      live: "https://autonomi-lake.vercel.app/",
      source: "https://github.com/RanneG/autonomi",
    },
  },
  {
    slug: "arbit",
    title: "Arbit",
    kind: "Dashboard",
    status: "Shipped",
    year: "2026",
    tagline: "See arbitrage edges before fees and latency eat them.",
    description:
      "A cryptocurrency arbitrage dashboard that turns noisy exchange spreads into a readable surface, with real-time market data visualisation.",
    stack: ["React", "TypeScript", "API integration", "Data visualisation"],
    links: {
      live: "https://arbit-psi.vercel.app",
      source: "https://github.com/RanneG/Arbit",
    },
  },
  {
    slug: "minesentry",
    title: "MineSentry",
    kind: "Monitoring",
    status: "Shipped",
    year: "2025",
    tagline: "Make mining-pool transaction selection observable.",
    description:
      "A Bitcoin censorship detection platform: a whistle-blowing system that detects when mining pools exclude transactions from blocks, so the community can spot censorship or policy shifts instead of guessing from mempool gossip.",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "Bitcoin RPC",
    ],
    links: {
      live: "https://minesentry.vercel.app/",
      source: "https://github.com/RanneG/MineSentry",
    },
  },
  {
    slug: "chatbot-rag-core",
    title: "Chatbot RAG Core",
    kind: "Library",
    status: "Shipped",
    year: "2026",
    tagline: "A local-first RAG building block.",
    description:
      "A reusable Python RAG chatbot library built on Ollama and LlamaIndex. Ingest documents, embed them locally and answer questions behind an API, without sending prompts to a remote model by default.",
    stack: ["Python", "LlamaIndex", "Ollama", "RAG", "Docker"],
    links: { source: "https://github.com/RanneG/chatbot-rag-core" },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
