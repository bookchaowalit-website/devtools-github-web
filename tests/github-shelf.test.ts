import { describe, expect, it } from "vitest";
import { filterRepositories, getRepository, isLens, seedRepositories } from "@/lib/github-shelf";

describe("seed shelf", () => {
  it("links only public GitHub repositories, and private ones carry no link", () => {
    for (const repository of seedRepositories) {
      if (repository.url) expect(repository.url).toBe(`https://github.com/${repository.owner}/${repository.name}`);
    }
    expect(getRepository("solo-empire")).toMatchObject({ url: "", status: "Archived" });
    expect(getRepository("analytics")?.status).toBe("Archived");
    expect(new Set(seedRepositories.map((r) => r.id)).size).toBe(seedRepositories.length);
  });
});

describe("filterRepositories", () => {
  it("filters by lens", () => {
    expect(filterRepositories(seedRepositories, "tools", "").map((r) => r.id)).toEqual(["devtools-suite", "devhub", "web-starter"]);
    expect(filterRepositories(seedRepositories, "all", "")).toHaveLength(seedRepositories.length);
  });

  it("searches every word over name, owner, role, description and language, case-insensitive and trimmed", () => {
    expect(filterRepositories(seedRepositories, "all", "  MCP portal ").map((r) => r.id)).toEqual(["devhub"]);
    expect(filterRepositories(seedRepositories, "systems", "typescript")).toEqual([]);
  });

  it("knows its lenses", () => {
    expect(isLens("tools")).toBe(true);
    expect(isLens("all")).toBe(false);
    expect(isLens("constructor")).toBe(false);
  });
});
