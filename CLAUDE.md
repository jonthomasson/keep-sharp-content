# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A content-only registry: Markdown challenges authored under `content/` are bundled into a static JSON catalog (`dist/manifest.json` + `dist/packs/<id>@<version>.json`) and published as GitHub Release assets. The Keep Sharp VS Code extension (separate repo: `keep-sharp-dev`) fetches that catalog over HTTP via jsDelivr or `raw.githubusercontent.com`. There is no server, no DB, no admin UI — the entire publication pipeline is "drop in a Markdown file, open a PR, tag a release."

The runtime `Challenge` shape lives in `keep-sharp-dev/src/models/Challenge.ts`. **`tools/schema.ts` here must stay in sync with it** — it is a build-time validator for the same shape, not an independent definition.

## Commands

```bash
npm install
npm run validate    # parse + validate every challenge; same code CI runs on PRs
npm run build       # write dist/manifest.json and dist/packs/*.json
npm run verify      # post-build sanity check: re-reads dist/, recomputes sha256s, re-validates each challenge
npm run clean       # rimraf dist
```

There is no test suite and no separate lint step — the Zod schema in `tools/schema.ts` is the only validation, and `npm run validate` is the single source of truth for content correctness.

To dry-run end-to-end with the extension locally, build then serve `dist/` over HTTP (Node's `fetch` rejects `file://`):

```bash
npm run build
npx serve dist -p 8787
# then in VS Code, set keepSharp.catalog.url = http://localhost:8787/manifest.json
```

## Architecture

### Build pipeline (`tools/build-catalog.ts`)

`build({ write })` is the single entry point shared by validate/build/verify. It:

1. Reads three allow-lists (`tools/topics.txt`, `languages.txt`, `frameworks.txt`) — one slug per line, `#` comments allowed.
2. Reads the pack registry (`tools/packs.json`) — maps `packId → { title, description, packVersion }`.
3. Walks `content/**/*.md`, parses YAML frontmatter via `gray-matter`, validates each frontmatter object with `challengeFrontmatterSchema`.
4. Cross-checks topics/language/framework against the allow-lists and `id` against `packs.json` (`packId` is the slash-prefix of `id`).
5. Groups by `packId`, sorts challenges by `id`, writes `dist/packs/<packId>@<packVersion>.json` and a top-level `dist/manifest.json` with sha256 + sizeBytes for each pack file.
6. **Fails non-zero on any error** — `validate.ts` re-runs the same builder with `write: false`.

`verify-dist.ts` is the post-build self-test: it reads `dist/` exactly the way the extension would, recomputes each pack's sha256, and re-runs `challengeFrontmatterSchema` against every challenge to catch any divergence between authored content and built artifact.

### Why allow-lists, not free-form

`topics.txt` / `languages.txt` / `frameworks.txt` exist so the extension's facet filters stay coherent. New values must be added to the relevant `.txt` in the same PR as the first challenge that uses them. The validator's error message names the exact file to update.

### Versioning

- **`packVersion`** in `tools/packs.json` (semver) — bump when a pack's content changes meaningfully so the extension knows to redownload the pack file. The pack file is named `<packId>@<packVersion>.json`, so a bump produces a new URL and a new sha.
- **`catalogVersion`** in the manifest — derived from build date (`YYYY.MM.DD`, UTC). Not an input, but matches the date-based release tag convention (`v2026.04.26`).
- **`schemaVersion`** — manifest is `1`, per-challenge/pack file is `2`. Bump only when the JSON shape itself changes (not when content changes).

### Release flow

CI is two workflows in `.github/workflows/`:

- `validate.yml` runs `npm run validate` on every PR and `main` push.
- `release.yml` triggers on tags matching `v*`: builds `dist/`, attaches `manifest.json` + every `dist/packs/*.json` to a GitHub Release. jsDelivr mirrors the new tag automatically.

Tag format is date-based: `git tag v2026.05.15 && git push origin v2026.05.15`. The extension polls every 24h or refreshes manually.

`dist/` is committed to the repo so jsDelivr can serve from the git tree at `HEAD` between releases — don't add `dist/` back to `.gitignore`.

## Authoring challenges

The full guide is in [CONTRIBUTING.md](./CONTRIBUTING.md). Key points when generating or modifying challenges:

- One Markdown file per challenge under `content/<lang>/<topic>/`. Filename should match the slug in `id`.
- `id` MUST be `<pack-id>/<slug>`, lowercase + hyphens, unique. The pack-id half must already exist in `tools/packs.json`.
- `expectedConcepts` is the **AI grading rubric** — never shown in the webview. Be concrete and specific. Don't restate the same items in the body.
- The body (after the closing `---`) becomes `instructions` and is rendered as Markdown. Don't include the answer there.
- For language-agnostic challenges, set top-level `language: '*'` and provide `variants[]`, each with its own `language` (and optional `starter`/`expectedConcepts`).

### YAML frontmatter pitfalls

Frontmatter is YAML, and YAML has parser traps that fail validation with confusing errors. **The fix is almost always to single-quote the offending value.** The recurring offenders:

- A list item containing `: ` (colon-space) — YAML reads it as a nested mapping. Quote the whole item.
- A list item starting with `{` or `[` — YAML reads it as a flow-mapping/sequence. Quote it.
- Multi-line code in `starter.code` — use the literal block scalar `|` (preserves newlines, ignores YAML special chars).

When in doubt, single-quote. To embed a single quote inside a single-quoted string, double it: `'it''s fine'`.

## Sync with `keep-sharp-dev`

If you change `tools/schema.ts` (adding a field, changing an enum, bumping `schemaVersion`), the corresponding change must land in `keep-sharp-dev/src/models/Challenge.ts` first or in lockstep — otherwise the extension will reject newly-built catalogs. The schema here is the build-time mirror; the extension's runtime types are the source of truth.
