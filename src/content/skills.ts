export type SkillGroup = {
  title: string;
  skills: string[];
  /** Where these skills were put to work: project slugs and role ids. */
  usedIn: { projects?: string[]; roles?: string[] };
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Product stack",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Tauri",
      "Vite",
      "Tailwind CSS",
      "Flask",
      "FastAPI",
    ],
    usedIn: {
      projects: ["stitch", "jibbynails-booking", "industrial-compliance-system"],
    },
  },
  {
    title: "AI & MCP",
    skills: [
      "Ollama",
      "Local LLMs",
      "LlamaIndex",
      "RAG",
      "MCP servers",
      "Cursor tooling",
      "Agent orchestration",
    ],
    usedIn: {
      projects: ["linkup-mcp", "stitch", "chatbot-rag-core", "supplyme"],
    },
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "AWS",
      "Terraform",
      "Infrastructure as code",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "CI/CD pipelines",
    ],
    usedIn: { roles: ["deloitte"] },
  },
  {
    title: "Data & scripting",
    skills: ["Python", "SQL", "Bash", "SAS"],
    usedIn: { roles: ["greenstone", "katalyze", "dwp"] },
  },
  {
    title: "Networks & endpoints",
    skills: [
      "Windows",
      "macOS",
      "Linux",
      "Wi-Fi / LAN",
      "DHCP / DNS",
      "VoIP & conferencing",
      "Microsoft 365",
      "Intune",
      "ServiceNow",
      "Active Directory",
    ],
    usedIn: { roles: ["cantium"] },
  },
  {
    title: "Process & people",
    skills: [
      "Agile / Scrum",
      "SOPs & runbooks",
      "Technical writing",
      "Stakeholder reporting",
      "ITSM",
      "Team leadership",
    ],
    usedIn: { roles: ["deloitte", "dome", "cantium"] },
  },
];
