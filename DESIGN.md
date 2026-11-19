---
name: Repository Reading Room
description: A curated repository shelf with context before the click.
colors:
  void: "#0d171a"
  void-soft: "#142328"
  paper: "#f1ead9"
  paper-soft: "#d9d0bb"
  ink: "#102024"
  line: "#40565a"
  muted: "#94a29d"
  signal-lime: "#d9f36a"
  alert-coral: "#e38b61"
  alert-strong: "#f0a27c"
typography:
  display:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "clamp(3.2rem, 8vw, 7.2rem)"
    fontWeight: 580
    lineHeight: 0.88
    letterSpacing: "-0.085em"
  body:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  data:
    fontFamily: "Space Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  pill: "999px"
spacing:
  frame: "1200px"
  section: "76px"
  content: "28px"
components:
  active-filter:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.void}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
---

> **Current look (2026-11-19):** the shelf uses the shared **Reader shell** (`READER.md`): Geist, light and dark, a
> searchable list with kind chips and one article page per record with previous/next. The "reading room" notes below
> are the earlier look, kept for history; its palette and Space fonts are no longer shipped.


# Design System: Repository Reading Room

## Overview

**Creative North Star: "The museum accession room after closing."**

Repository Reading Room treats code as an artifact that deserves context. The dark room recedes, the index creates a quiet order, and the selected record receives a large uninterrupted reading surface. Lime is a catalog signal: it marks what is selected, active, or worth opening. The experience is intentionally a shelf and index rather than a dashboard or social feed.

The design borrows the discipline of accession records and the fixed-region clarity of old computer screens, then keeps the interface modern through responsive type, semantic controls, and no decorative enclosures around every item.

**Key Characteristics:**

- Deep void background with paper text and one signal-lime accent.
- Index rows on the left; one selected artifact on the right.
- Evidence-first copy, local-only boundaries, and no invented GitHub metrics.

## Colors

The palette is a nocturnal archive: dark enough to let a repository name lead, warm paper for reading, and lime for the catalog's active edge.

### Primary

- **Catalog Lime** (`#d9f36a`): selected filters, active repository state, and primary open action.

### Secondary

- **Alert Coral** (`#e38b61`): destructive remove action only.

### Neutral

- **Archive Void** (`#0d171a`): room ground.
- **Soft Void** (`#142328`): reserved for future tonal surfaces.
- **Paper** (`#f1ead9`): primary reading text.
- **Paper Soft** (`#d9d0bb`): supporting copy.
- **Index Line** (`#40565a`): dividers and inactive control borders.

### Named Rules

**The Catalog Signal Rule.** Lime belongs to active selection and meaningful action; it never becomes a general decorative highlight.

## Typography

**Display Font:** Space Grotesk (with Arial, sans-serif)

**Body Font:** Space Grotesk (with Arial, sans-serif)

**Label/Mono Font:** Space Mono (with SFMono-Regular, Consolas, monospace)

**Character:** Large sans type gives the shelf a confident public voice. Mono labels turn owner, role, lens, and proof into quiet catalog metadata.

### Hierarchy

- **Display** (580, `clamp(3.2rem, 8vw, 7.2rem)`, `0.88`): public statement at the room entrance.
- **Headline** (580, `clamp(2.25rem, 5vw, 4.8rem)`, `0.95`): selected repository name.
- **Body** (400, `1rem`, `1.65`): context and description.
- **Label** (400, `0.6–0.72rem`, tracked, uppercase): catalog metadata and controls.

## Layout

The room uses a centered 1200px frame. The intro is a two-part entrance: a large statement and the current shelf count. The toolbar is a ruled strip. Below it, the desktop surface is split into an index column and a selected-record stage; on mobile the index becomes a full-width list above the record. No content relies on horizontal scrolling.

## Elevation & Depth

Depth comes from the dark room, thin index rules, and the selected record's generous breathing room. There are no cards stacked inside cards and no decorative glass or shadow system. The selected record enters once with a short vertical arrival; reduced motion removes it.

## Shapes

The room is mostly square and editorial. Filter controls and actions use pill silhouettes because they represent switchable catalog states. Index rows remain open and full-width so the shelf reads as a list, not a grid of unrelated cards.

## Components

### Buttons

- **Lens filters:** outlined pills at rest, lime-filled when selected, `aria-pressed` state.
- **Index rows:** full-width text controls with selected lime text and a small left inset.
- **Record actions:** pill links/buttons; the primary open action is lime-filled.
- **Focus:** 3px lime outline with 4px offset for all controls and links.

### Cards / Containers

- **Index panel:** an ordered list with visible numbers, repository names, and roles.
- **Record sheet:** one open stage for the selected artifact, with proof line, metadata, and actions.
- **Add record:** native disclosure/summary control with a compact form; no modal interruption.

## Do's and Don'ts

- Do lead with what a repository is for and why it is worth opening.
- Do keep local-only and unverified metadata explicit.
- Do let the selected artifact own the stage.
- Don't turn the shelf into a GitHub clone or activity feed.
- Don't invent stars, traffic, users, contributors, or performance claims.
- Don't wrap every row in a rounded card or add a generic metric dashboard.
