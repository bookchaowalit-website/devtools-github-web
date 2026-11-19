# Repository Reading Room

A small shelf of hand-written repository records: search, filter by kind, and open one to read what it is and why it is on the shelf. No GitHub API.

Live: https://github.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does not do

- No GitHub API or live data. Records change only by editing `lib/github-shelf.ts` (checked against GitHub when edited).

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: shelf data and filter, shelf and record pages, Reader shell, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/github-shelf.ts`: the authored records, lens labels, `filterRepositories` and `getRepository`.
- `components/shelf-views.tsx`: the shelf (`/`, `?q=` search and `?lens=` chips) and record (`/repos/<id>`) pages.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/reader-shell.css`, `components/reader-shell.tsx`, `tests/reader-shell.test.tsx`: the shared Reader shell, copied
  byte for byte from content-techblog-web (see `READER.md`). `/more-projects` is a permanent redirect to https://bookchaowalit.com/.
