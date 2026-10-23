"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { blankDraft, filterRepositories, lensLabels, nextSelectedId, recordFromDraft, seedRepositories, type Lens } from "@/lib/github-shelf";

export default function Home() {
  const [repositories, setRepositories] = useState(seedRepositories);
  const [lens, setLens] = useState<Lens>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(seedRepositories[0].id);
  const [draft, setDraft] = useState(blankDraft);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => filterRepositories(repositories, lens, query), [lens, query, repositories]);

  const selected = filtered.find((repository) => repository.id === selectedId) ?? filtered[0] ?? null;

  function updateDraft(field: keyof typeof blankDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function addRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const repository = recordFromDraft(draft);
    if (!repository) return;
    setRepositories((current) => [repository, ...current]);
    setSelectedId(repository.id);
    setDraft(blankDraft);
  }

  async function copyRecord() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(`${selected.name} — ${selected.role}\n${selected.description}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function removeRepository(id: string) {
    setRepositories((current) => current.filter((repository) => repository.id !== id));
    setSelectedId((current) => nextSelectedId(filtered, current, id));
  }

  return (
    <main className="reading-room">
      <div className="room-frame">
        <header className="room-header">
          <Link className="room-mark" href="/" aria-label="Repository Reading Room home">
            <span className="room-mark-dot" aria-hidden="true" />
            <span>Repository Reading Room</span>
          </Link>
          <span className="room-location">Bookchaowalit · GitHub shelf</span>
        </header>

        <section className="room-intro" aria-labelledby="page-title">
          <div>
            <h1 id="page-title">A shelf of things worth opening.</h1>
            <p>Curated repository records with enough context to choose the next artifact, not another scroll through a link dump.</p>
          </div>
          <div className="shelf-count">
            <strong>{String(repositories.length).padStart(2, "0")}</strong>
            <span>records<br />on this shelf</span>
          </div>
        </section>

        <div className="room-toolbar">
          <label className="search-line">
            <span>Find a record</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, role, or language" />
          </label>
          <div className="lens-list" aria-label="Filter repository records" role="group">
            {(Object.keys(lensLabels) as Lens[]).map((key) => (
              <button key={key} type="button" className={lens === key ? "lens-button is-active" : "lens-button"} aria-pressed={lens === key} onClick={() => setLens(key)}>
                {lensLabels[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="shelf-layout">
          <aside className="index-panel" aria-label="Repository index">
            <div className="index-heading">
              <span>Index</span>
              <span>{filtered.length} shown</span>
            </div>
            {filtered.length > 0 ? (
              <ol className="index-list">
                {filtered.map((repository, index) => (
                  <li key={repository.id}>
                    <button type="button" className={selected?.id === repository.id ? "index-row is-selected" : "index-row"} onClick={() => setSelectedId(repository.id)}>
                      <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="index-name">{repository.name}</span>
                      <span className="index-role">{repository.role}</span>
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="empty-index">No records match this shelf view.</p>
            )}
            <details className="add-record">
              <summary>Place a new record</summary>
              <form onSubmit={addRepository}>
                <label>Name<input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} required /></label>
                <label>Owner<input value={draft.owner} onChange={(event) => updateDraft("owner", event.target.value)} /></label>
                <label>Role<input value={draft.role} onChange={(event) => updateDraft("role", event.target.value)} required /></label>
                <label>Language<input value={draft.language} onChange={(event) => updateDraft("language", event.target.value)} /></label>
                <label>Why inspect it?<textarea value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} rows={3} /></label>
                <label>GitHub URL<input type="url" value={draft.url} onChange={(event) => updateDraft("url", event.target.value)} placeholder="https://github.com/..." /></label>
                <button className="submit-record" type="submit">Add to shelf</button>
              </form>
            </details>
          </aside>

          <section className="record-stage" aria-live="polite" aria-label="Selected repository">
            {selected ? (
              <article className="record-sheet">
                <div className="record-topline">
                  <span>{selected.status}</span>
                  <span>{selected.lens}</span>
                </div>
                <p className="record-owner">{selected.owner}</p>
                <h2>{selected.name}</h2>
                <p className="record-role">{selected.role}</p>
                <p className="record-description">{selected.description}</p>
                <div className="record-proof">
                  <span>Proof line</span>
                  <strong>{selected.proof}</strong>
                </div>
                <dl className="record-meta">
                  <div><dt>Language</dt><dd>{selected.language}</dd></div>
                  <div><dt>Record</dt><dd>{selected.status === "Draft" ? "Local draft" : "Curated shelf item"}</dd></div>
                </dl>
                <div className="record-actions">
                  {selected.url ? (
                    <a href={selected.url} target="_blank" rel="noreferrer">Open repository <span aria-hidden="true">↗</span></a>
                  ) : (
                    <span className="record-no-link">No public link</span>
                  )}
                  <button type="button" onClick={copyRecord}>{copied ? "Record copied" : "Copy record"}</button>
                  <button type="button" className="remove-action" onClick={() => removeRepository(selected.id)}>Remove</button>
                </div>
              </article>
            ) : (
              <div className="empty-stage"><p>Nothing is on this shelf view yet.</p><span>Change the lens or place a new record from the index.</span></div>
            )}
          </section>
        </div>

        <footer className="room-footer">
          <span>Local shelf · no GitHub API connection</span>
          <span>Context before click.</span>
        </footer>
      </div>
    </main>
  );
}
