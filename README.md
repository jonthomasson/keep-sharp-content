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

## Authoring a new challenge

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT.
