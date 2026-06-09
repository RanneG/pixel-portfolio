import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import type { PortfolioData, SiteConfig } from "../types";
import { loadConfig, mergePortfolioData } from "../utils/configLoader";

// Fallback data if JSON files fail to load
const defaultData: PortfolioData = {
  name: "RANNE GERODIAS",
  title:
    "I'm a full-stack engineer with a DevOps and data background: I've automated cloud delivery at scale, supported enterprise IT and analytics, and I now focus on local-first and privacy-aware products—TypeScript/React and Tauri on the front, Python and RAG/Ollama on the back, with MCP and agent-style tooling where it fits.",
  subtitle: "DEVELOPER // DESIGNER // CREATOR",
  motto: "Build tools, not just features.",
  workExperience: [
    {
      company: "Cantium Business Solutions (Kings Hill, UK)",
      role: "Help Desk Engineer",
      start: "Feb 2026",
      end: "Ongoing",
      url: "https://www.cantium.group/",
      paragraphs: [
        "First-line support for desktops, laptops, printers, and mobile devices on Windows, macOS, and Linux, including Microsoft 365, VPN, and common business security tools.",
        "Hands-on repairs (RAM, drives, displays), basic network triage (Wi‑Fi, LAN, DHCP, DNS), and setup for VoIP phones, conference rooms, and video collaboration.",
        "Work is logged in ITSM tooling (Microsoft Intune, ServiceNow, Active Directory). I prepare and deploy new-hire kits: laptops, monitors, and accessories."
      ]
    },
    {
      company: "Dome (London, UK)",
      role: "Manager",
      start: "Jun 2025",
      end: "Feb 2026",
      paragraphs: [
        "Recruited, trained, and led a team with clear communication and scheduling so day-to-day operations stayed smooth.",
        "Maintained supplier relationships and inventory to keep sales and stock levels predictable through busy periods."
      ]
    },
    {
      company: "Deloitte (London, UK)",
      role: "Junior DevOps Engineer",
      start: "Dec 2021",
      end: "Jul 2023",
      url: "https://www.deloitte.com/uk/en.html",
      paragraphs: [
        "Delivered client deployments using Agile practice — QA cycles, Scrum, and sprint-based releases with a focus on repeatable quality.",
        "Created technical documentation, guidelines, and SOPs so teams could share knowledge across AWS, Terraform, Docker, Kubernetes, and Jira.",
        "Automated multi-region AWS provisioning (including ACM-related patterns) as infrastructure-as-code, integrated into Jenkins with Python and Java. That cut a previously long manual process down to roughly a single day."
      ]
    },
    {
      company: "Greenstone Data Solutions Ltd (Kings Hill, UK)",
      role: "Junior Production Programmer",
      start: "Oct 2019",
      end: "Mar 2020",
      paragraphs: [
        "Built scripts to automate database workflows using Bash, Python, SAS, and SQL.",
        "Helped migrate source control from local and virtualised file storage into GitHub for safer collaboration."
      ]
    },
    {
      company: "Katalyze Data (Witney, UK)",
      role: "Data Analyst",
      start: "Jul 2019",
      end: "Oct 2019",
      paragraphs: [
        "Wrote Python for deployment automation, configuration, and monitoring so environments stayed consistent.",
        "Designed and tuned SQL for faster retrieval and cleaner downstream reporting."
      ]
    },
    {
      company: "Department for Work and Pensions (Dartford, UK)",
      role: "Support Analyst",
      start: "Dec 2018",
      end: "May 2019",
      url: "https://www.gov.uk/government/organisations/department-for-work-pensions",
      paragraphs: [
        "Produced reports and visualisations so stakeholders could see trends and act on evidence.",
        "Improved data collection practices so insight stayed reliable and easier to reproduce."
      ]
    }
  ],
  education: [
    {
      institution: "University of Kent",
      location: "Canterbury, Kent",
      start: "2020",
      end: "2021",
      qualification: "Computer Science MSc"
    },
    {
      institution: "University of Kent",
      location: "Canterbury, Kent",
      start: "2015",
      end: "2019",
      qualification: "Mathematics BSc"
    }
  ],
  bio: [
    "> Clear docs, reliable automation, and interfaces that respect the user.",
    "> Side work: Stitch, linkup_mcp (LlamaIndex + Ollama RAG), MCP for Cursor, OpenClaw on a dedicated Mac."
  ],
  statusBadges: ["CAFFEINATED", "MOTIVATED", "CREATIVE"],
  stats: {
    projects: 7,
    level: "ENGINEER",
    creativity: "HIGH"
  },
  attributes: {
    STR: 70,
    DEX: 84,
    INT: 92,
    CHA: 78
  },
  skills: [
    {
      title: "CLOUD & DEVOPS",
      color: "secondary",
      mastery: 86,
      skills: [
        { name: "AWS (MULTI-REGION, ACM-STYLE PATTERNS)", level: 86 },
        { name: "TERRAFORM / IaC", level: 88 },
        { name: "DOCKER / KUBERNETES / JENKINS", level: 82 },
        { name: "CI/CD PIPELINES (PYTHON / JAVA)", level: 84 }
      ]
    },
    {
      title: "AI & MCP",
      color: "primary",
      mastery: 88,
      skills: [
        { name: "OLLAMA / LOCAL LLMS", level: 86 },
        { name: "LLAMAINDEX / RAG", level: 88 },
        { name: "MCP SERVERS / CURSOR TOOLING", level: 85 },
        { name: "OPENCLAW / AGENT ORCHESTRATION", level: 72 }
      ]
    },
    {
      title: "NETWORK & ENDPOINTS",
      color: "secondary",
      mastery: 80,
      skills: [
        { name: "WI-FI / LAN / DHCP / DNS", level: 82 },
        { name: "VoIP / CONFERENCING SETUP", level: 76 },
        { name: "WINDOWS / MACOS / LINUX DESKTOPS", level: 84 },
        { name: "INTUNE / SERVICENOW / AD / M365", level: 80 }
      ]
    },
    {
      title: "DATA & SCRIPTING",
      color: "primary",
      mastery: 82,
      skills: [
        { name: "PYTHON", level: 88 },
        { name: "SQL", level: 85 },
        { name: "BASH", level: 80 },
        { name: "SAS", level: 68 }
      ]
    },
    {
      title: "PRODUCT / STACK",
      color: "accent",
      mastery: 87,
      skills: [
        { name: "TYPESCRIPT / REACT", level: 88 },
        { name: "TAURI / VITE (STITCH)", level: 86 },
        { name: "FLASK / PYTHON APIs", level: 84 },
        { name: "TAILWIND / LOCAL-FIRST UX", level: 82 }
      ]
    },
    {
      title: "PROCESS & CLIENT",
      color: "accent",
      mastery: 84,
      skills: [
        { name: "AGILE / SCRUM / SOPs / RUNBOOKS", level: 86 },
        { name: "STAKEHOLDER REPORTING / VIZ", level: 82 },
        { name: "TEAM SCHEDULING & OPS (DOME)", level: 80 },
        { name: "TECH WRITING / ITSM / ONBOARDING KITS", level: 86 }
      ]
    }
  ],
  specialAbilities: [
    "> Ships local-first surfaces where privacy and ownership are part of the product story.",
    "> Automates the boring path: infra, kits, and pipelines so teams stop firefighting the same week.",
    "> Grounds AI in tools you control: RAG on your files, MCP in the editor, agents on your own metal.",
    "> Keeps L2–L4 and endpoint reality in mind when something breaks in prod or on a user laptop."
  ],
  projects: [
    {
      title: "STITCH",
      difficulty: "LEGENDARY",
      status: "IN PROGRESS",
      featured: true,
      description:
        "Local-first subscription companion: Tauri + React desktop (stitch-app), Python Flask bridge for RAG over your PDFs, Google sign-in + Gmail discovery, and optional face MFA.",
      motivation:
        "Own your subscription data and search it locally: a desktop shell plus a Python bridge so PDFs and Gmail context stay on your machine, with optional stronger auth — not another siloed SaaS dashboard.",
      highlight: "Desktop · voice approve · optional face MFA",
      tech: ["TAURI", "REACT", "PYTHON", "FLASK", "RAG", "GOOGLE OAUTH"],
      githubUrl: "https://github.com/RanneG/stitch-app",
      imageUrl: "/images/projects/stitch.svg",
      questId: "ST-001"
    },
    {
      title: "LINKUP MCP",
      difficulty: "LEGENDARY",
      status: "IN PROGRESS",
      featured: true,
      description:
        "Custom MCP server for Cursor: Linkup web search plus local RAG over your documents (LlamaIndex + Ollama). Powers Stitch's document brain and editor-side tooling.",
      motivation:
        "Keep AI assistance on your machine and in your editor — search the web when needed, answer from your PDFs without shipping them to a cloud chat UI.",
      highlight: "stdio MCP for Cursor; Flask bridge for Stitch desktop",
      tech: ["PYTHON", "MCP", "LLAMAINDEX", "OLLAMA", "FLASK"],
      githubUrl: "https://github.com/RanneG/linkup_mcp",
      imageUrl: "/images/projects/linkup-mcp.svg",
      questId: "LM-001"
    },
    {
      title: "LUCKY CHARM",
      difficulty: "LEGENDARY",
      status: "COMPLETED",
      featured: true,
      description:
        "Privacy-preserving standup and meeting transcript tool: wallet-first auth, TEE-oriented processing, Props-filtered dashboard — structured themes and actions without verbatim quotes leaving the trust boundary.",
      motivation:
        "Teams need standup signal without leaking raw transcripts: wallet-first auth, filtered views, and TEE-oriented framing so structured themes ship without verbatim quotes crossing the trust line.",
      highlight: "Encode Club hackathon winner",
      award: "Encode Club hackathon winner",
      tech: ["REACT", "VITE", "WALLET AUTH", "TEE", "FLASK"],
      githubUrl: "https://github.com/RanneG/standup-bot",
      liveUrl: "https://lucky-charm-taupe.vercel.app/",
      imageUrl: "/images/projects/lucky-charm.svg",
      questId: "LC-001"
    },
    {
      title: "AUTONOMI",
      difficulty: "LEGENDARY",
      status: "COMPLETED",
      description:
        "Autonomous lending protection on Arc. 24/7 lending bodyguard that auto-rebalances your USYC/USDC position when LTV crosses the safety threshold — no liquidation surprises.",
      motivation:
        "Hackathon build to keep Arc lending positions inside a safe band automatically so users sleep through volatility instead of babysitting LTV.",
      tech: ["DEFI", "ARC", "USYC", "USDC", "AUTO REBALANCING", "ENCODE HACKATHON"],
      githubUrl: "https://github.com/RanneG/autonomi",
      liveUrl: "https://autonomi-lake.vercel.app/",
      questId: "AU-001"
    },
    {
      title: "ARBIT",
      difficulty: "LEGENDARY",
      status: "COMPLETED",
      description: "Cryptocurrency arbitrage opportunity dashboard with real-time market data visualization.",
      motivation:
        "Turn noisy exchange spreads into a readable surface so you can see where edges exist before fees and latency eat them.",
      tech: ["REACT", "API INTEGRATION", "DATA VISUALIZATION", "FINANCIAL ALGORITHMS"],
      githubUrl: "https://github.com/RanneG/Arbit",
      liveUrl: "https://arbit-psi.vercel.app",
      questId: "AR-001"
    },
    {
      title: "MINESENTRY",
      difficulty: "EPIC",
      status: "COMPLETED",
      description: "Bitcoin censorship detection platform - whistle-blowing system for detecting when mining pools exclude transactions from blocks.",
      motivation:
        "Make pool transaction selection observable so the community can spot censorship or policy shifts instead of guessing from mempool gossip alone.",
      tech: ["REACT", "TYPESCRIPT", "TAILWIND CSS", "PYTHON", "FASTAPI", "BITCOIN RPC"],
      githubUrl: "https://github.com/RanneG/MineSentry",
      liveUrl: "https://minesentry.vercel.app/",
      questId: "MS-001"
    },
    {
      title: "CHATBOT RAG CORE",
      difficulty: "EPIC",
      status: "COMPLETED",
      description:
        "Reusable Python RAG chatbot library using Ollama for local AI. Document Q&A, embeddings, and production-ready API server.",
      motivation:
        "A small library you can drop behind an API: ingest docs, embed with Ollama, and answer questions without shipping prompts to a remote model by default.",
      highlight: "Ollama + LlamaIndex — local-first RAG building block.",
      tech: ["PYTHON", "LLAMAINDEX", "OLLAMA", "RAG", "DOCKER"],
      githubUrl: "https://github.com/RanneG/chatbot-rag-core",
      questId: "CB-001"
    }
  ],
  contact: {
    email: "rannegerodias@gmail.com",
    location: "UNITED KINGDOM",
    timezone: "UTC+0 (GMT/BST)"
  },
  socialLinks: [
    { name: "GITHUB", url: "https://github.com/RanneG" },
    { name: "LINKEDIN", url: "https://www.linkedin.com/in/ranne-gerodias-809460108/" }
  ],
  availableForHire: true
};

interface PortfolioDataContextType {
  data: PortfolioData;
  config: SiteConfig;
  isLoading: boolean;
  reload: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{
  children: ReactNode;
  data?: Partial<PortfolioData>;
}> = ({ children, data: overrideData }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultData);
  const [config, setConfig] = useState<SiteConfig>({
    site: { title: "", description: "", logo: "<DEV/>", formspreeId: "" },
    features: { konamiCode: true, settingsPanel: true, installPrompt: true, analytics: false }
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const loadedConfig = await loadConfig();
      
      // Merge loaded data
      const merged = mergePortfolioData(
        loadedConfig.personal,
        loadedConfig.stats,
        loadedConfig.skills,
        loadedConfig.projects
      );
      
      // Apply any override data passed as props
      const finalData = overrideData ? { ...merged, ...overrideData } : merged;
      
      setPortfolioData(finalData);
      setConfig(loadedConfig.config);
    } catch (error) {
      console.error("Error loading config:", error);
      // Use defaults on error
      setPortfolioData(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [overrideData]);

  return (
    <PortfolioDataContext.Provider
      value={{
        data: portfolioData,
        config,
        isLoading,
        reload: loadData
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within PortfolioDataProvider");
  }
  return context;
};

