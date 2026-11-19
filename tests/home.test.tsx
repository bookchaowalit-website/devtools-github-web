import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import RepositoryPage, { generateMetadata, generateStaticParams } from "@/app/repos/[id]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { ShelfView } from "@/components/shelf-views";
import { seedRepositories } from "@/lib/github-shelf";
import nextConfig from "@/next.config";

const home = async (params: Record<string, string | string[]> = {}) => renderToString(await Home({ searchParams: Promise.resolve(params) }));

describe("shelf page", () => {
  it("renders the shelf with one h1, a count, kind chips, every record and the no-API notice", async () => {
    const html = await home();
    expect(html).toContain("A shelf of things worth opening.");
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(`${seedRepositories.length} repositories`);
    for (const r of seedRepositories) expect(html).toContain(`href="/repos/${r.id}"`);
    expect(html).toContain("No GitHub API connection");
    expect(html).toContain('href="https://bookchaowalit.com/"');
  });

  it("searches and filters by kind, keeping the query on chips", async () => {
    const html = await home({ q: "typescript", lens: "tools" });
    expect(html).toContain("Showing 3 of");
    expect(html).toContain("in Tools for “typescript”");
    expect(html).toContain('href="/?q=typescript"');
    expect(html).toContain('href="/?lens=tools">Clear');
  });

  it("ignores an unknown kind and offers a way back when nothing matches", async () => {
    const html = await home({ q: ["zzzz"], lens: "<b>" });
    expect(html).toContain("No repository matches");
    expect(html).toContain("Show the whole shelf");
    expect(renderToString(<ShelfView repositories={seedRepositories} query="zzzz" lens="tools" />)).toMatch(/in (<!-- -->)?Tools/);
    expect(renderToString(<ShelfView repositories={[]} />)).toContain("The shelf is empty");
  });
});

describe("repository page", () => {
  it("shows a public record with its GitHub link and previous/next", async () => {
    const html = renderToString(await RepositoryPage({ params: Promise.resolve({ id: "devhub" }) }));
    expect(html).toContain("devtools-devhub-web");
    expect(html).toContain('href="https://github.com/bookchaowalit-website/devtools-devhub-web"');
    expect(html).toContain('rel="prev"');
    expect(html).toContain('rel="next"');
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it("shows no link for the private record", async () => {
    const html = renderToString(await RepositoryPage({ params: Promise.resolve({ id: "solo-empire" }) }));
    expect(html).toContain("This repository is private, so there is no public link.");
    expect(html).not.toContain("github.com/bookchaowalit/solo-empire");
  });

  it("prebuilds every record, gives each a title, and 404s an unknown id", async () => {
    expect(generateStaticParams()).toHaveLength(seedRepositories.length);
    expect((await generateMetadata({ params: Promise.resolve({ id: "devhub" }) })).alternates?.canonical).toBe("/repos/devhub");
    expect(await generateMetadata({ params: Promise.resolve({ id: "nope" }) })).toEqual({});
    await expect(RepositoryPage({ params: Promise.resolve({ id: "nope" }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});

describe("site", () => {
  it("redirects /more-projects to the hub and publishes sitemap and robots on its own domain", async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true });
    expect(sitemap().map((e) => e.url)).toContain("https://github.bookchaowalit.com/repos/devhub");
    expect(robots().sitemap).toBe("https://github.bookchaowalit.com/sitemap.xml");
  });
});
