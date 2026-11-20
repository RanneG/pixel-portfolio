export const site = {
  name: "Ranne Gerodias",
  role: "Full-stack engineer",
  tagline: "Build tools, not just features.",
  url: "https://rannegerodias.com",
  description:
    "Full-stack engineer with a DevOps and data background, building local-first, privacy-aware products: TypeScript, React and Tauri up front, Python with RAG and Ollama behind.",
  location: "United Kingdom",
  timezone: "GMT / BST",
  email: "rannegerodias@gmail.com",
  availableForHire: true,
  links: {
    github: { label: "github.com/RanneG", href: "https://github.com/RanneG" },
    linkedin: {
      label: "linkedin.com/in/ranne-gerodias",
      href: "https://www.linkedin.com/in/ranne-gerodias-809460108/",
    },
  },
} as const;

export const menu = [
  { href: "/about", label: "About Me" },
  { href: "/projects", label: "Projects" },
  { href: "/roles", label: "Roles" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
] as const;

export const about = {
  paragraphs: [
    "I'm a full-stack engineer with a DevOps and data background. I've automated multi-region cloud delivery at Deloitte, supported enterprise IT, and worked in analytics.",
    "These days I build local-first, privacy-aware products: TypeScript, React and Tauri up front, Python with RAG and Ollama behind, and MCP tooling where it earns its place.",
  ],
  facts: [
    { label: "Now", value: "Help Desk Engineer, Cantium Business Solutions" },
    { label: "Based", value: "United Kingdom (GMT / BST)" },
    {
      label: "Education",
      value: "MSc Computer Science and BSc Mathematics, University of Kent",
    },
    {
      label: "Open to",
      value: "Local-first product work, MCP and RAG tooling, DevOps automation",
    },
  ],
} as const;
