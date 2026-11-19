// Repository Reading Room: the authored shelf and its filter rules.
// Every record is written by hand and checked against GitHub when it changes; there is no GitHub API call.

export type Lens = "systems" | "tools" | "portfolio";

export type Repository = {
  id: string;
  name: string;
  owner: string;
  role: string;
  description: string;
  language: string;
  status: "Active" | "Archived";
  lens: Lens;
  /** Why it is on the shelf: what the repository shows. */
  proof: string;
  /** Public GitHub URL, or "" when the repository is private and has no public link. */
  url: string;
};

// Checked against GitHub on 2026-11-19 (visibility, archive state, language, description).
export const seedRepositories: Repository[] = [
  {
    id: "platform-cellkit",
    name: "platform-cellkit",
    owner: "bookchaowalit",
    role: "Microservice toolkit",
    description: "One cell.yaml drives a service's API, migrations, roles, event publisher and MCP server. A library, not a service.",
    language: "Python",
    status: "Active",
    lens: "systems",
    proof: "The shared kit the personal platform's services are built on",
    url: "https://github.com/bookchaowalit/platform-cellkit",
  },
  {
    id: "solo-empire",
    name: "solo-empire",
    owner: "bookchaowalit",
    role: "Former operating system",
    description: "The personal control plane for projects, knowledge, tasks and operating context, before it was split into separate repositories.",
    language: "Python",
    status: "Archived",
    lens: "systems",
    proof: "Private and archived in November 2026, so there is no public link",
    url: "",
  },
  {
    id: "devtools-suite",
    name: "devtools-suite-web",
    owner: "bookchaowalit-website",
    role: "Developer tool workbench",
    description: "Seventeen browser developer tools (Base64, regex, cron, hashes, JSON, diff and more) in one site with one shared shell.",
    language: "TypeScript",
    status: "Active",
    lens: "tools",
    proof: "Many small tools held to one design and accessibility floor",
    url: "https://github.com/bookchaowalit-website/devtools-suite-web",
  },
  {
    id: "devhub",
    name: "devtools-devhub-web",
    owner: "bookchaowalit-website",
    role: "API developer portal",
    description: "A catalog and browser playground for the MCP servers exposed by the portfolio's sibling projects.",
    language: "TypeScript",
    status: "Active",
    lens: "tools",
    proof: "An interface for exploring developer capability",
    url: "https://github.com/bookchaowalit-website/devtools-devhub-web",
  },
  {
    id: "web-starter",
    name: "web-starter",
    owner: "bookchaowalit",
    role: "Web app template",
    description: "The starting point for new web apps: Next.js 16, design tokens that pass the accessibility floor, scrubbed error reporting and shared CI.",
    language: "TypeScript",
    status: "Active",
    lens: "tools",
    proof: "The defaults every new site starts from",
    url: "https://github.com/bookchaowalit/web-starter",
  },
  {
    id: "techblog",
    name: "content-techblog-web",
    owner: "bookchaowalit-website",
    role: "Technical blog",
    description: "Writing on web development, React, Next.js and TypeScript; also the source of the Reader shell this page uses.",
    language: "TypeScript",
    status: "Active",
    lens: "portfolio",
    proof: "Long-form writing with a calm reading layout",
    url: "https://github.com/bookchaowalit-website/content-techblog-web",
  },
  {
    id: "analytics",
    name: "data-analytics-dashboard-web",
    owner: "bookchaowalit-website",
    role: "Signal reading instrument",
    description: "A local surface for reading a performance trace without pretending to be a connected analytics SaaS.",
    language: "TypeScript",
    status: "Archived",
    lens: "portfolio",
    proof: "Archived here in October 2026; a twin repository now deploys the live site",
    url: "https://github.com/bookchaowalit-website/data-analytics-dashboard-web",
  },
];

export const lensLabels: Record<Lens, string> = {
  systems: "Systems",
  tools: "Tools",
  portfolio: "Portfolio pieces",
};

export function isLens(value: unknown): value is Lens {
  return typeof value === "string" && Object.hasOwn(lensLabels, value);
}

export function getRepository(id: string): Repository | undefined {
  return seedRepositories.find((repository) => repository.id === id);
}

/** Records in `lens` ("all" for every lens) whose name, owner, role, description or language contain every word of `query`. */
export function filterRepositories(repositories: Repository[], lens: Lens | "all", query: string): Repository[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return repositories.filter((repository) => {
    const haystack = `${repository.name} ${repository.owner} ${repository.role} ${repository.description} ${repository.language}`.toLowerCase();
    return (lens === "all" || repository.lens === lens) && words.every((word) => haystack.includes(word));
  });
}
