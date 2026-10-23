# Repository Reading Room — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `github`) on 2026-10-23.

## What it is

A client-only shelf of three hand-written repository records (one private, so it carries no link) with search, lens filters and a local draft form. Records live in React state only; there is no GitHub API call.

## Who it is for

A portfolio visitor who wants context on a few repositories before clicking through.

## What works today

1. Search name, owner, role, description and language; filter by lens (Systems, Tools, Portfolio pieces).
2. Open a record to read its role, description, proof line and language; open its public GitHub page, or see "No public link" for a private repository.
3. Place a new record (name and role required). Only http(s) links are kept; anything else is dropped. Copy a record to the clipboard or remove it.
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No GitHub API, real-time data, stars, commits or contribution activity (removed from the portfolio card in the 2026-10 review).
- Nothing is saved: added or removed records reset on reload.
- No MCP route (the unused GitHub relay route was removed on 2026-10-15).

## Live URL and deploy state

- Live: https://github.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-github-frontend` was last deployed to production on 2026-10-15 (commit 8d4021d, before the Next 16.4.2 CVE patch). The CVE patch deploy is queued with the coordinator (Vercel free-plan deploy limit hit on 2026-10-23). Its Git link names the old repository `bookchaowalit/bookchaowalit-github-frontend`, so a push to `main` does not deploy: the L2 work stays undeployed until the owner reconnects Vercel Git to this repository (owner action D9). `NEXT_PUBLIC_SENTRY_DSN` is already set on the Vercel project (Sentry project `devtools-github-web`, org `personal-yu0`).

## Boundaries

- Browser-only. No API routes, no storage, no network calls of its own.
