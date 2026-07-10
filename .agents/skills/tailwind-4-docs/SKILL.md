---
name: tailwind-4-docs
description: Comprehensive Tailwind CSS v4 documentation snapshot and workflow guidance. Use when answering Tailwind v4 questions, selecting utilities/variants, configuring Tailwind v4, or migrating projects from v3 to v4 with official docs and gotcha checks.
compatibility: Requires git, Python 3, and internet access to initialize the Tailwind docs snapshot from tailwindcss.com.
---

# Tailwind 4 Docs

## Overview

Use this skill to navigate a locally synced Tailwind CSS v4 documentation snapshot and answer development, configuration, migration, implementation, refactor, and review questions with official guidance.

The docs snapshot is not bundled with this skill because the upstream repository is source-available but not open-source. Users must initialize the snapshot themselves and are responsible for complying with the upstream license.

## Quick start

1. Check whether the docs snapshot is initialized (`references/docs/` and `references/docs-index.tsx` exist).
2. If the snapshot is missing or older than one week, stop and ask to run the initialization step in "Initialization" before continuing. Do not answer the user's question until the snapshot is initialized.
3. Identify the topic (utility, variant, config, migration, compatibility, implementation, refactor, review).
4. Find the matching doc in `references/docs-index.tsx`.
5. Load only the relevant file from `references/docs/`.
6. For implementation, refactor, or review tasks, also load `references/engineering-playbook.md`.
7. Apply guidance and call out any breaking changes or constraints.

## Initialization (required once per install)

Run the sync script to download the Tailwind docs locally. This requires network access, git, and Python 3:

```
python skills/tailwind-4-docs/scripts/sync_tailwind_docs.py --accept-docs-license
```

This pulls content from `tailwindlabs/tailwindcss.com`. That repo is source-available and explicitly not open-source, so the user must accept its license before downloading and keep the snapshot local.

If you cannot run tools or have no internet access, ask the user to run the exact command above in a terminal, then continue once `references/docs/` and `references/docs-index.tsx` exist.

If the snapshot is missing or older than one week, you must ask for permission to run the command or ask the user to run it. Do not proceed with Tailwind guidance until the snapshot is initialized or refreshed.

If initialization is blocked (no internet or no write access), use `references/gotchas.md` as a limited fallback and ask the user to consult the official docs. For implementation, refactor, or review tasks, `references/engineering-playbook.md` can also serve as a limited fallback.

## References map

- `references/docs/` is generated locally and contains the Tailwind v4 MDX docs snapshot.
- `references/docs-index.tsx` is generated locally and contains the category and slug map used by the docs sidebar.
- `references/docs-source.txt` captures the upstream repo, commit, and snapshot date (or reports that initialization is pending).
- `references/engineering-playbook.md` is the agent-oriented implementation, refactor, and review guide.
- `references/gotchas.md` provides a quick scan of common v4 migration pitfalls.

## MDX handling

- Treat `export const title` and `export const description` as metadata.
- Read JSX callouts like `<TipInfo>` or `<TipBad>` as guidance text.

## Common entry points

- Migration: `references/docs/upgrade-guide.mdx`, `references/docs/compatibility.mdx`.
- Implementation/refactor/review: `references/engineering-playbook.md`.
- Gotchas overview: `references/gotchas.md`.
- Configuration and directives: `references/docs/functions-and-directives.mdx`, `references/docs/adding-custom-styles.mdx`, `references/docs/theme.mdx`.
- Variants and responsive patterns: `references/docs/hover-focus-and-other-states.mdx`, `references/docs/responsive-design.mdx`.
- Core behavior: `references/docs/preflight.mdx`, `references/docs/detecting-classes-in-source-files.mdx`.

## Migration checklist

When upgrading from v3 to v4, always confirm the following in the docs:

- Browser support and compatibility expectations.
- Tooling changes: `@tailwindcss/postcss`, `@tailwindcss/cli`, `@tailwindcss/vite`.
- Import syntax: `@import "tailwindcss"` replaces `@tailwind` directives.
- Utility renames/removals, prefix format, and important modifier placement.
- Changes to variants, transforms, and arbitrary value syntax.

## Update workflow

Run `scripts/sync_tailwind_docs.py` to refresh the snapshot. Use `--local-repo` if you already have a local clone of `tailwindlabs/tailwindcss.com` to speed up syncs. Always pass `--accept-docs-license`.

---
