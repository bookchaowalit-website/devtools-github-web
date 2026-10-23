import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders the shelf, the first record and the no-API notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("A shelf of things worth opening.");
    expect(html).toContain("devtools-devhub-web");
    expect(html).toContain("Local shelf · no GitHub API connection");
  });

  it("shows no repository link for the private first record", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("No public link");
    expect(html).not.toContain("github.com/bookchaowalit/solo-empire");
  });
});
