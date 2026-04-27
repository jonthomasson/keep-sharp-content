# keep-sharp-content

Source content and build tooling for the **Keep Sharp** challenge catalog.

The Keep Sharp VS Code extension fetches challenges from a published catalog hosted as static JSON. This repo is where authors add new challenges, CI validates them, and tagged releases publish a `manifest.json` + per-pack JSON files attached as release assets (served via [jsDelivr](https://www.jsdelivr.com/) or `raw.githubusercontent.com`).

## Layout

```
keep-sharp-content/
├── content/                    # one Markdown file per challenge
│   ├── typescript/fundamentals/*.md
│   ├── javascript/fundamentals/*.md
│   └── csharp/fundamentals/*.md
├── tools/
│   ├── build-catalog.ts        # walks content/, validates, writes dist/
│   ├── validate.ts             # CI-only: validates without writing
│   ├── schema.ts               # Zod schema (mirrors keep-sharp-dev's Challenge.ts)
│   ├── packs.json              # per-pack title / description / packVersion
│   ├── topics.txt              # allow-list of topic tags
│   ├── languages.txt           # allow-list of language slugs
│   └── frameworks.txt          # allow-list of framework slugs
├── dist/                       # generated; published as release assets
└── .github/workflows/
    ├── validate.yml            # PR check
    └── release.yml             # on tag v*: build + GitHub Release
```

## Local quick-start

```bash
npm install
npm run validate     # parse + validate every challenge; non-zero on any error
npm run build        # write dist/manifest.json and dist/packs/*.json
```

## Pointing the extension at your local dist/

Node's `fetch` does not support `file://` URLs, so for local end-to-end testing you need a tiny HTTP server:

```bash
# from this repo's root, after npm run build:
npx serve dist -p 8787
```

Then in VS Code (Extension Development Host):

1. Settings → search "keepSharp.catalog.url"
2. Set to `http://localhost:8787/manifest.json`
3. Run **Keep Sharp: Refresh Challenge Catalog** → toast confirms manifest fetched
4. Run **Keep Sharp: Browse Challenge Catalog** → install a pack
5. Run **Keep Sharp: Start Challenge** → packs from this repo appear alongside the built-ins

## Publishing

1. Bump `packVersion` in `tools/packs.json` for each pack you changed.
2. Commit on `main` (CI runs `validate` on the PR).
3. Tag a release: `git tag v2026.04.26 && git push origin v2026.04.26`.
4. The `release` workflow builds `dist/` and creates a GitHub Release with `manifest.json` + each `packs/*.json` attached.
5. Users get the new content on their next catalog refresh (24h auto, or manual via the Refresh command).

## Adding a new challenge

The full workflow is "drop in a Markdown file, open a PR" — no UI, no DB, no admin tool. Five steps:

### 1. Pick or create a pack

Each challenge belongs to one pack, derived from the slash-prefix in its `id`. Existing packs are registered in [`tools/packs.json`](./tools/packs.json):

| Pack id | What's in it |
|---|---|
| `ts-fundamentals` | Core TypeScript |
| `js-fundamentals` | Vanilla JavaScript |
| `csharp-fundamentals` | C# language essentials |

Adding to an existing pack? Skip to step 2.

Creating a new pack? Add an entry to `tools/packs.json` first:

```json
{
  "your-pack-id": {
    "title": "Your Pack Title",
    "description": "One-sentence description shown in the catalog browser.",
    "packVersion": "0.1.0"
  }
}
```

### 2. Write a Markdown file with YAML frontmatter

One file per challenge anywhere under `content/<lang>/<topic>/`. The filename should match the slug in the `id`. The body becomes the rendered instructions; the frontmatter is everything else.

```markdown
---
id: ts-fundamentals/explain-pure-functions     # required: <pack-id>/<slug>, lowercase + hyphens, unique
title: Explain pure functions                  # required: 3-120 chars
category: explain                              # explain | debug | write | refactor | tests | security | a11y | architecture | design
difficulty: beginner                           # beginner | intermediate | advanced
language: typescript                           # see tools/languages.txt
topics: [fundamentals]                         # 1-8, must be in tools/topics.txt
expectedConcepts:                              # 1-8 items, never shown in webview — this is the AI's rubric
  - same input always produces same output
  - no side effects (no I/O, no mutation of arguments, no global state)
  - easier to test, reason about, and parallelize
starter:                                       # optional — omit for "write from scratch" challenges
  kind: single
  language: typescript
  code: |
    function add(a: number, b: number): number {
      return a + b;
    }
---

In 2-3 sentences, explain what makes a function "pure" and why pure functions
are easier to test than functions that read from a database or modify shared state.
```

Optional fields: `framework`, `tags`, `solutionArchetypes`, `variants` (for language-agnostic challenges). See [CONTRIBUTING.md](./CONTRIBUTING.md) for full details and examples of each.

### 3. Validate locally

```bash
npm run validate
```

You'll get either `OK — N pack(s), M challenge(s) validated` or a precise per-file list of what's wrong. CI runs the same command on PRs.

### 4. Open a PR

Push your branch and open a PR against `main`. CI runs `validate.yml` automatically. Once merged, your challenge ships in the next tagged release.

### 5. (Maintainer) Cut a release

When you're ready to publish accumulated changes:

```bash
git tag v2026.05.15        # date-based — matches the manifest's catalogVersion
git push origin v2026.05.15
```

The `release.yml` workflow builds `dist/`, creates a GitHub Release with `manifest.json` + each `packs/*.json` attached, and jsDelivr mirrors the new tag. Users get the new content on their next catalog refresh (auto every 24h, or manual via **Keep Sharp: Refresh Challenge Catalog**).

If you bumped a pack's content meaningfully, also bump its `packVersion` in `tools/packs.json` so the extension knows to redownload it.

For style tips, edge cases, and gotchas (like the YAML quoting traps), see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT.
