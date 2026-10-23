# Repository Reading Room

A small shelf of hand-written repository records: search, filter by lens, open one to read why it matters, and add or remove records for this visit. No GitHub API.

Live: https://github.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does not do

- No GitHub API or live data. Nothing is saved; changes reset on reload.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: shelf filter, draft and link rules, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/github-shelf.ts`: the authored records, lens labels, `filterRepositories`, `recordFromDraft`, `safeRepositoryUrl` and `nextSelectedId`.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
