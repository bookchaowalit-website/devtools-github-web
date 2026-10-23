import { describe, expect, it } from "vitest";
import { blankDraft, filterRepositories, nextSelectedId, recordFromDraft, safeRepositoryUrl, seedRepositories } from "@/lib/github-shelf";

describe("seed shelf", () => {
  it("links only public repositories under their current names", () => {
    const urls = seedRepositories.map((repository) => repository.url);
    expect(urls).toEqual(["", "https://github.com/bookchaowalit-website/devtools-devhub-web", "https://github.com/bookchaowalit-website/data-analytics-dashboard-web"]);
    expect(seedRepositories.find((repository) => repository.id === "analytics")?.status).toBe("Archived");
  });
});

describe("filterRepositories", () => {
  it("filters by lens", () => {
    expect(filterRepositories(seedRepositories, "tools", "").map((r) => r.id)).toEqual(["devhub"]);
    expect(filterRepositories(seedRepositories, "all", "")).toHaveLength(3);
  });

  it("searches name, owner, role, description and language, case-insensitive and trimmed", () => {
    expect(filterRepositories(seedRepositories, "all", "  PYTHON ").map((r) => r.id)).toEqual(["solo-empire"]);
    expect(filterRepositories(seedRepositories, "all", "mcp servers").map((r) => r.id)).toEqual(["devhub"]);
    expect(filterRepositories(seedRepositories, "systems", "mcp")).toEqual([]);
  });
});

describe("safeRepositoryUrl", () => {
  it("keeps http(s) links", () => {
    expect(safeRepositoryUrl(" https://github.com/a/b ")).toBe("https://github.com/a/b");
    expect(safeRepositoryUrl("http://example.com")).toBe("http://example.com/");
  });

  it("drops javascript:, data: and unparsable links instead of rendering them", () => {
    expect(safeRepositoryUrl("javascript:alert(1)")).toBe("");
    expect(safeRepositoryUrl("data:text/html,<b>x</b>")).toBe("");
    expect(safeRepositoryUrl("github.com/a/b")).toBe("");
    expect(safeRepositoryUrl("")).toBe("");
  });
});

describe("recordFromDraft", () => {
  it("needs a name and a role", () => {
    expect(recordFromDraft({ ...blankDraft, name: "x" })).toBeNull();
    expect(recordFromDraft({ ...blankDraft, role: "y" })).toBeNull();
    expect(recordFromDraft({ ...blankDraft, name: "  ", role: "y" })).toBeNull();
  });

  it("trims fields, fills honest placeholders and never keeps an unsafe link", () => {
    const record = recordFromDraft({ ...blankDraft, name: " My Repo ", role: " lib ", url: "javascript:alert(1)" }, 42);
    expect(record).toMatchObject({
      id: "my-repo-42",
      name: "My Repo",
      role: "lib",
      owner: "Unspecified owner",
      language: "Not recorded",
      status: "Draft",
      url: "",
    });
  });
});

describe("nextSelectedId", () => {
  const visible = seedRepositories;
  it("keeps the selection when another record is removed", () => {
    expect(nextSelectedId(visible, "devhub", "analytics")).toBe("devhub");
  });

  it("moves to the first visible survivor when the selected record is removed", () => {
    expect(nextSelectedId(visible, "solo-empire", "solo-empire")).toBe("devhub");
    expect(nextSelectedId([visible[0]], "solo-empire", "solo-empire")).toBe("");
  });
});
