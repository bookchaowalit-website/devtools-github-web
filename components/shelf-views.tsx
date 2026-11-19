import Link from "next/link";
import {
  ArticleHeader,
  EmptyState,
  EntryList,
  Pager,
  Prose,
  Reader,
  ReaderFoot,
  ReaderHead,
  ReaderTop,
  ResultCount,
  SearchForm,
  TagFilter,
  neighbours,
  type Entry,
} from "@/components/reader-shell";
import { filterRepositories, lensLabels, type Lens, type Repository } from "@/lib/github-shelf";

export const SITE = "https://github.bookchaowalit.com";
const SOURCE = "https://github.com/bookchaowalit-website/devtools-github-web";
const NOTE = "A hand-written shelf, checked against GitHub when it changes. No GitHub API connection: no live stars, commits or activity.";
const LENSES = Object.keys(lensLabels) as Lens[];

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <Reader>
      <ReaderTop name="Repository Reading Room" tagline="GitHub shelf" links={[{ href: "https://github.com/bookchaowalit-website", label: "GitHub" }]} />
      <main id="main" className="rs-main">{children}</main>
      <ReaderFoot source={SOURCE} note={NOTE} />
    </Reader>
  );
}

function toEntry(repository: Repository): Entry {
  return {
    href: "/repos/" + repository.id,
    title: repository.name,
    summary: repository.description,
    meta: [repository.role, repository.language, ...(repository.status === "Archived" ? ["Archived"] : [])],
    tags: [lensLabels[repository.lens]],
  };
}

export function ShelfView({ repositories, query = "", lens = "" }: { repositories: Repository[]; query?: string; lens?: string }) {
  // Chips come from the lenses the code knows, never straight from the URL.
  const active = (LENSES as string[]).includes(lens) ? (lens as Lens) : "";
  const matching = filterRepositories(repositories, "all", query);
  const shown = active ? matching.filter((r) => r.lens === active) : matching;
  const href = (l: string, q = query) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (l) params.set("lens", l);
    const text = params.toString();
    return "/" + (text ? "?" + text : "");
  };

  return (
    <Frame>
      <ReaderHead
        eyebrow="Repository Reading Room"
        title="A shelf of things worth opening."
        lede="A few repositories with enough context to choose what to open next: what each one is, what it shows, and whether it is still active."
      />
      <div className="rs-toolbar">
        <SearchForm label="Find a repository" action="/" placeholder="Name, role or language" defaultValue={query} hidden={active ? { lens: active } : {}} clearHref={href(active, "")} />
        <TagFilter
          label="Filter by kind"
          options={[
            { href: href(""), label: "All", current: !active, count: matching.length },
            ...LENSES.map((l) => ({ href: href(l), label: lensLabels[l], current: l === active, count: matching.filter((r) => r.lens === l).length })),
          ]}
        />
        <ResultCount shown={shown.length} total={repositories.length} noun="repository" plural="repositories" query={query || undefined} filter={active ? lensLabels[active] : undefined} />
      </div>
      {shown.length ? (
        <EntryList entries={shown.map(toEntry)} />
      ) : repositories.length ? (
        <EmptyState title="No repository matches" action={<Link className="rs-plain" href="/">Show the whole shelf</Link>}>
          Nothing on the shelf matches {query ? <>“{query}”</> : "this kind"}{active && query ? <> in {lensLabels[active]}</> : null}. Try a shorter word or another kind.
        </EmptyState>
      ) : (
        <EmptyState title="The shelf is empty">Repositories appear here once they are added to the shelf.</EmptyState>
      )}
    </Frame>
  );
}

export function RepositoryView({ repository, all }: { repository: Repository; all: Repository[] }) {
  const { previous, next } = neighbours(all, all.findIndex((r) => r.id === repository.id));
  return (
    <Frame>
      <article className="rs-article">
        <ArticleHeader
          back={{ href: "/", label: "The whole shelf" }}
          tags={[lensLabels[repository.lens], repository.status]}
          title={repository.name}
          lede={repository.description}
          meta={[repository.role, repository.owner, repository.language]}
        />
        <Prose>
          <h2>Why it is on the shelf</h2>
          <p>{repository.proof}.</p>
          <h2>Where to find it</h2>
          {repository.url ? (
            <p><a href={repository.url} rel="noreferrer">Open {repository.owner}/{repository.name} on GitHub</a></p>
          ) : (
            <p>This repository is private, so there is no public link.</p>
          )}
        </Prose>
        <Pager
          label="More repositories"
          previous={previous ? { href: "/repos/" + previous.id, title: previous.name } : undefined}
          next={next ? { href: "/repos/" + next.id, title: next.name } : undefined}
        />
      </article>
    </Frame>
  );
}
