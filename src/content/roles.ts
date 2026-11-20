export type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  /** Omitted for the current role. */
  end?: string;
  url?: string;
  points: string[];
};

export const roles: Role[] = [
  {
    id: "cantium",
    title: "Help Desk Engineer",
    company: "Cantium Business Solutions",
    location: "Kings Hill, UK",
    start: "Feb 2026",
    url: "https://www.cantium.group/",
    points: [
      "First-line support for desktops, laptops, printers and mobile devices across Windows, macOS and Linux, including Microsoft 365, VPN and security tooling.",
      "Hands-on repairs, network triage (Wi-Fi, LAN, DHCP, DNS), and setup for VoIP phones and conference rooms.",
      "Prepare and deploy new-hire kits, with work logged in Intune, ServiceNow and Active Directory.",
    ],
  },
  {
    id: "dome",
    title: "Manager",
    company: "Dome",
    location: "London, UK",
    start: "Jun 2025",
    end: "Feb 2026",
    points: [
      "Recruited, trained and led a team, with clear scheduling that kept day-to-day operations smooth.",
      "Managed supplier relationships and inventory to keep stock predictable through busy periods.",
    ],
  },
  {
    id: "deloitte",
    title: "Junior DevOps Engineer",
    company: "Deloitte",
    location: "London, UK",
    start: "Dec 2021",
    end: "Jul 2023",
    url: "https://www.deloitte.com/uk/en.html",
    points: [
      "Automated multi-region AWS provisioning as infrastructure as code, integrated into Jenkins with Python and Java. That cut a long manual process to roughly a day.",
      "Delivered client deployments in Agile sprints with QA cycles.",
      "Wrote technical documentation and SOPs across AWS, Terraform, Docker and Kubernetes.",
    ],
  },
  {
    id: "greenstone",
    title: "Junior Production Programmer",
    company: "Greenstone Data Solutions",
    location: "Kings Hill, UK",
    start: "Oct 2019",
    end: "Mar 2020",
    points: [
      "Automated database workflows with Bash, Python, SAS and SQL.",
      "Helped migrate source control from local file storage into GitHub.",
    ],
  },
  {
    id: "katalyze",
    title: "Data Analyst",
    company: "Katalyze Data",
    location: "Witney, UK",
    start: "Jul 2019",
    end: "Oct 2019",
    points: [
      "Wrote Python for deployment automation, configuration and monitoring.",
      "Designed and tuned SQL for faster retrieval and cleaner reporting.",
    ],
  },
  {
    id: "dwp",
    title: "Support Analyst",
    company: "Department for Work and Pensions",
    location: "Dartford, UK",
    start: "Dec 2018",
    end: "May 2019",
    url: "https://www.gov.uk/government/organisations/department-for-work-pensions",
    points: [
      "Produced reports and visualisations so stakeholders could act on evidence.",
      "Improved data collection practices so insight stayed reliable and reproducible.",
    ],
  },
];

export const education = [
  {
    qualification: "Computer Science MSc",
    institution: "University of Kent",
    years: "2020 – 2021",
  },
  {
    qualification: "Mathematics BSc",
    institution: "University of Kent",
    years: "2015 – 2019",
  },
] as const;
