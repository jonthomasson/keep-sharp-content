---
description: Generate a varied pack of Keep Sharp challenges for a given language, drafting frontmatter + body for each, writing them under content/, and validating.
argument-hint: "[language] [count] [--pack <id>] [--topic <slug>] [--lib <name>]"
---

You are bulk-authoring a pack of Keep Sharp challenges. Arguments: `$ARGUMENTS`.

- **Positional**: first token = language slug, optional second token = challenge count (default 6).
- **`--pack <id>`** (optional): target a specific pack id (e.g. `ts-rxjs`, `js-arrays`). If omitted, defaults to `<lang>-fundamentals`.
- **`--topic <slug>`** (optional): narrow the pack's topical focus (e.g. `reactive`, `collections`). Used to bias category/topic selection in Step 2 and to default the content subdirectory.
- **`--lib <name>`** (optional, repeatable): runtime npm package the challenges depend on (e.g. `--lib rxjs`, `--lib zod`). Triggers the library-dependency convention in Steps 2–3.

Read this whole file before doing anything. The constraints come from the schema, not from convention — the validator will reject anything that drifts.

## Step 1 — resolve inputs

1. Read `tools/languages.txt`, `tools/topics.txt`, `tools/frameworks.txt`, `tools/packs.json`, and `tools/schema.ts`. These are the source of truth.
2. **Language**:
   - If `$ARGUMENTS` provides a language token, use it. Otherwise list `tools/languages.txt` to the user and ask which one.
   - If the chosen language is not in `tools/languages.txt`, ask whether to add it. If yes, append it (one slug per line, alphabetized, blank line at EOF preserved).
3. **Count**: take from `$ARGUMENTS` if present; otherwise default to 6. Cap at 10 unless the user explicitly asks for more.
4. **Pack scope** — branch on `--pack`:
   1. **`--pack <id>` provided AND id exists in `tools/packs.json`** → extend that pack. Bump `packVersion` minor (`0.1.0 → 0.2.0`, `0.2.0 → 0.3.0`). Confirm the bump with the user once. Use it for adding focused challenges to an existing pack (e.g. `--pack js-fundamentals` to add array-method challenges to the JS fundamentals pack).
   2. **`--pack <id>` provided AND id is new** → propose a new entry: title (Title Case, e.g. `TypeScript: RxJS Operators`), one-sentence description, `packVersion: "0.1.0"`. Add it to `tools/packs.json`. Use it for topic-focused or library-focused packs (e.g. `ts-rxjs`, `ts-react-patterns`, `js-arrays`).
   3. **No `--pack` provided** → look for `<lang>-fundamentals` in `tools/packs.json`. If it exists, default to extending it (confirm + bump as in branch 1). Otherwise propose creating it (default id `<lang>-fundamentals`, title e.g. `Python Fundamentals`, `packVersion: "0.1.0"`).
5. **Existing content** — avoid duplicate `id`s, titles, and topic angles:
   - List `content/<language>/**/*.md` (broad language-level view).
   - Additionally, list every file whose frontmatter `id` starts with `<packId>/` — this is the authoritative dupe-check for an existing pack, since challenges may live across multiple topic subdirectories.
   - When extending, summarize the existing pack's category/difficulty/topic spread back to the user so the new set complements rather than overlaps.

## Step 2 — propose the set

Before writing any files, draft a numbered table of the planned challenges with: `id`, `title`, `category`, `difficulty`, `topic(s)`, and (when `--lib` was passed) the `lib` dependency. Aim for variety:

- **Categories** (pick from): `explain` `debug` `write` `refactor` `tests` `security` `a11y` `architecture` `design`. Use at least 4 different categories across the set. For a focused pack (e.g. `ts-rxjs`), narrow the category mix to what makes sense — RxJS suits `write`/`refactor`/`debug`/`architecture` more than `a11y`.
- **Difficulty mix**: roughly 50% beginner, 33% intermediate, 17% advanced. Don't make everything beginner.
- **Topics**: spread across `tools/topics.txt`. Avoid putting two challenges on the same topic unless the count > 6. If a topic you want is missing, add it to `tools/topics.txt` (one slug per line, alphabetized) and mention it in the proposal. For a focused pack, the `--topic` argument should anchor most challenges to that topic; secondary topics still help diversify.
- **Real-world flavor**: each challenge should map to a thing the language is actually used for. No contrived "FizzBuzz with extra steps."
- **Library/framework dependencies**: when `--lib <name>` was provided (or you notice the challenges need a runtime package), call it out explicitly in a `lib` column. The author / user needs to know what `npm install` they must run in their scratch dir before the challenge can be executed.

Show the table to the user briefly so they can redirect (auto mode: proceed if they don't push back within the same turn — but pause if the proposal looks weak or you need a judgment call).

## Step 3 — write each challenge file

One file per challenge at `content/<language>/<topic>/<slug>.md`. The `<slug>` matches the second half of the `id`. When `--topic` was provided and the pack is focused on it, prefer `content/<language>/<topic>/` as the default subdirectory for the whole set (e.g. RxJS challenges → `content/typescript/reactive/`).

### Library-dependent challenges

When the pack needs a runtime npm package (e.g. `rxjs`, `zod`, `lodash`):

- **In the starter code**: import from the package as usual (`import { ... } from 'rxjs'`) and include a one-line comment at the top documenting the install: `// Setup: npm install rxjs`.
- **In the rendered body** (after the closing `---`): add a short **Setup** callout near the top, e.g.:
  > **Setup:** This challenge imports from `rxjs`. In your scratch directory, run `npm install rxjs` once. The TypeScript runner (`npx -y tsx`) resolves it from `node_modules`.
- **Schema note**: there is no `runtime` field in the schema today. Don't invent one. The starter comment + body callout are the convention; if a real `runtime` field gets added later, migrate then.

### Frontmatter shape (from `tools/schema.ts`)

```yaml
---
id: <pack-id>/<slug>           # required, lowercase + hyphens, unique
title: <3-120 chars>           # required
category: <one of the 9>       # required
difficulty: beginner|intermediate|advanced
language: <slug from languages.txt>
topics: [<1-8 from topics.txt>]
expectedConcepts:              # 1-8 items, each ≥3 chars — the AI grading rubric, NEVER shown to user
  - specific, concrete bullet
  - another concrete bullet
framework: <optional, from frameworks.txt>
tags: [<optional, free-form, ≤8>]
solutionArchetypes:            # optional, ≤6 items — accepted alternative approaches
  - approach A
  - approach B
starter:                       # optional — omit for "explain" challenges, usually include for write/debug/refactor/tests
  kind: single
  language: <slug>
  code: |
    // multiline code here, indented consistently
---
```

### Body

After the closing `---`, write 2–4 sentences of Markdown that become the rendered instructions. Use lists, **bold**, `inline code`, fenced code blocks freely — the body is plain Markdown, not YAML.

### Style requirements

- **`expectedConcepts` is the rubric.** Be concrete and specific. ("uses parameterized query, not string concatenation" — not "writes secure SQL".) The AI uses these to grade; vibes won't help it.
- **Don't put the answer in `instructions`.** Don't paraphrase the rubric there either. The body should describe the task; the rubric is what a passing answer would mention.
- **Realistic difficulty.** Beginner = first-week-of-the-language stuff. Don't mark something beginner if it needs domain context (auth flows, distributed systems, etc.).
- **Small starters.** ≤30 lines unless wading through complexity is the point of the challenge.
- **No trick questions.** This is a learning tool, not hazing.

### YAML pitfalls — required quoting

YAML has parser traps that fail validation with confusing errors. The fix is almost always to single-quote the offending value:

- **Colon-space inside a list item**: `- common use: as const ...` → YAML reads as a nested mapping. Quote it: `- 'common use: as const ...'`.
- **List item starting with `{` or `[`**: YAML reads as flow-mapping/sequence. Quote it.
- **Multi-line code in `starter.code`**: use the literal block scalar `|` (preserves newlines, ignores YAML special chars). Indent code consistently.
- **Single quote inside a single-quoted string**: double it. `'it''s fine'`.

When in doubt, single-quote.

## Step 4 — validate

Run `npm run validate`. If it fails:

- Read the error output carefully — it names the file and field.
- Most failures are YAML quoting (see pitfalls above), unknown topic/language/framework (extend the relevant `.txt`), or `expectedConcepts` items shorter than 3 chars / outside the 1–8 range.
- Fix and re-run until it reports `OK — N pack(s), M challenge(s) validated.`

If you only want to validate without publishing, stop here. Otherwise continue — Step 5 builds, commits, and ships in one pipeline.

## Step 5 — build, commit, push to main, and cut a release

This step lands the changes on `main` and publishes a release. Summarize what's about to ship (file count, pack id, allow-list edits, version bump) and ask the user **once**:

> Build, commit to main, and publish? (will push main + a v<YYYY.MM.DD> tag, triggering release.yml)

Wait for an explicit yes. If the user declines, stop here — they'll publish manually. If they accept, run the pipeline straight through. Stop and surface any failure immediately rather than pressing on.

### 5a. Clean build + verify

```bash
npm run clean && npm run build && npm run verify
```

`clean` matters because the build keeps `dist/packs/` between runs — without it, stale files like `ts-fundamentals@0.1.0.json` linger in the committed tree after a version bump. `verify` re-reads `dist/`, recomputes each pack's sha256, and re-validates every challenge against the built artifact.

### 5b. Stage explicitly and commit on main

```bash
git status
git diff --stat
git checkout main
git pull --ff-only origin main
```

Stage **only** the files this command produced — never `git add -A` or `git add .`. The typical set is:

- `content/<language>/**/*.md` — the new challenges
- `tools/packs.json` — if a new pack was added or `packVersion` was bumped
- `tools/languages.txt` / `tools/topics.txt` / `tools/frameworks.txt` — only if you appended (topic-focused or library-focused packs frequently need a new `topics.txt` slug — don't forget this one)
- `dist/manifest.json` and `dist/packs/*.json` — the rebuilt catalog

Then commit with a HEREDOC message:

```
git commit -m "$(cat <<'EOF'
Add <pack-id> pack (<n> challenges)

<one-line summary of category/difficulty spread>
EOF
)"
```

Do not pass `--no-verify` or `-c commit.gpgsign=false`. If a pre-commit hook fails, fix the underlying issue and create a NEW commit (do not amend).

### 5c. Push main and cut the release tag

```bash
git push origin main

TAG="v$(date -u +%Y.%m.%d)"
git tag "$TAG"
git push origin "$TAG"
```

Tag format is date-based UTC (`vYYYY.MM.DD`). If today's tag already exists from an earlier release, append a suffix: `v2026.04.29.1`, `.2`, etc. — check with `git tag --list "$TAG*"` before tagging.

The tag push triggers `.github/workflows/release.yml`, which builds `dist/` on the runner and attaches `manifest.json` + every `dist/packs/*.json` to a new GitHub Release. jsDelivr mirrors the new tag automatically.

### 5d. Watch the release workflow

Don't claim success until the workflow has finished:

```bash
gh run watch --exit-status $(gh run list --workflow=release.yml --branch="$TAG" --limit 1 --json databaseId -q '.[0].databaseId')
```

If `gh run watch` exits non-zero, fetch the failing job's logs (`gh run view --log-failed`) and surface the error to the user — don't retry blindly.

### 5e. Confirm the release exists

```bash
gh release view "$TAG"
```

This prints the asset list (`manifest.json` + each pack file) and the release URL.

## Step 6 — final summary

Report:

- Pack id and version (and whether it was new or extended)
- Files created/modified (relative paths) — including the rebuilt `dist/` files
- Validation + verify result
- Any allow-list files you appended to (`languages.txt`, `topics.txt`, `frameworks.txt`)
- Commit sha on `main`
- Release tag, GitHub Release URL, and the jsDelivr URL for the new manifest:
  `https://cdn.jsdelivr.net/gh/<owner>/<repo>@<tag>/manifest.json`
- Note: the VS Code extension picks up the new pack on its next 24h poll or via manual refresh

## Notes

- `tools/schema.ts` mirrors `keep-sharp-dev/src/models/Challenge.ts`. Don't invent fields; if the schema rejects something, the schema is right.
- `dist/` is committed but generated — don't hand-edit it. The pipeline rebuilds and commits it as part of Step 5.
- The publication pipeline goes straight to `main` and tags a release. There is no PR step. If the user wants to inspect locally first, they can decline the prompt at Step 5 and run `npm run build && npx serve dist -p 8787`, then point `keepSharp.catalog.url` at `http://localhost:8787/manifest.json`.
- Only one release tag per UTC day by default. For multiple releases on the same day, use suffixes (`v2026.04.29.1`, `.2`).
