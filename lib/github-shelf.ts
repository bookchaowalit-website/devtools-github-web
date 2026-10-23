// Repository Reading Room: the authored shelf, its filter rules and the local draft form rules.
// Records live in React state only (nothing is saved); there is no GitHub API call anywhere.

export type Lens = "all" | "systems" | "tools" | "portfolio";

export type Repository = {
  id: string;
  name: string;
  owner: string;
  role: string;
  description: string;
  language: string;
  status: "Pinned" | "Active" | "Archived" | "Draft";
  lens: Exclude<Lens, "all">;
  proof: string;
  /** Public GitHub URL, or "" when the repository is private and has no public link. */
  url: string;
};

export const seedRepositories: Repository[] = [
  {
    id: "solo-empire",
    name: "solo-empire",
    owner: "bookchaowalit",
    role: "Operating system",
    description: "A personal control plane for projects, knowledge, tasks, and durable operating context.",
    language: "TypeScript · Python",
    status: "Pinned",
    lens: "systems",
    proof: "The system this shelf is part of (private repository, no public link)",
    url: "",
  },
  {
    id: "devhub",
    name: "devtools-devhub-web",
    owner: "bookchaowalit-website",
    role: "API developer portal",
    description: "A catalog and browser playground for MCP servers exposed by the portfolio ecosystem.",
    language: "Next.js · TypeScript",
    status: "Active",
    lens: "tools",
    proof: "An interface for exploring developer capability",
    url: "https://github.com/bookchaowalit-website/devtools-devhub-web",
  },
  {
    id: "analytics",
    name: "data-analytics-dashboard-web",
    owner: "bookchaowalit-website",
    role: "Signal reading instrument",
    description: "A local surface for reading a performance trace without pretending to be a connected analytics SaaS.",
    language: "Next.js · TypeScript",
    status: "Archived",
    lens: "portfolio",
    proof: "A product-specific interface, not a starter dashboard",
    url: "https://github.com/bookchaowalit-website/data-analytics-dashboard-web",
  },
];

export const lensLabels: Record<Lens, string> = {
  all: "All records",
  systems: "Systems",
  tools: "Tools",
  portfolio: "Portfolio pieces",
};

export const blankDraft = {
  name: "",
  owner: "",
  role: "",
  description: "",
  language: "",
  url: "",
};

export function makeId(name: string, now: number = Date.now()) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${now}`;
}

export type Draft = typeof blankDraft;

/** Only http(s) links are kept; anything else (javascript:, data:, typos) becomes "" and shows no link. */
export function safeRepositoryUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function filterRepositories(repositories: Repository[], lens: Lens, query: string): Repository[] {
  const normalized = query.trim().toLowerCase();
  return repositories.filter((repository) => {
    const matchesLens = lens === "all" || repository.lens === lens;
    const haystack = `${repository.name} ${repository.owner} ${repository.role} ${repository.description} ${repository.language}`.toLowerCase();
    return matchesLens && (!normalized || haystack.includes(normalized));
  });
}

/** A draft needs a name and a role (null otherwise); blank optional fields get honest placeholders. */
export function recordFromDraft(draft: Draft, now: number = Date.now()): Repository | null {
  if (!draft.name.trim() || !draft.role.trim()) return null;
  return {
    id: makeId(draft.name.trim(), now),
    name: draft.name.trim(),
    owner: draft.owner.trim() || "Unspecified owner",
    role: draft.role.trim(),
    description: draft.description.trim() || "A repository saved for a closer look.",
    language: draft.language.trim() || "Not recorded",
    status: "Draft",
    lens: "tools",
    proof: "A local record waiting for evidence",
    url: safeRepositoryUrl(draft.url),
  };
}

/** After removing a record, keep the selection if it survives, else move to the first visible survivor. */
export function nextSelectedId(visible: Repository[], selectedId: string, removedId: string): string {
  if (selectedId !== removedId) return selectedId;
  return visible.find((repository) => repository.id !== removedId)?.id ?? "";
}

