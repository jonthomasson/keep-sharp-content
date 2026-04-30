---
description: Generate a varied pack of Keep Sharp challenges for a given language, drafting frontmatter + body for each, writing them under content/, and validating.
argument-hint: "[language] [count]"
---

You are bulk-authoring a pack of Keep Sharp challenges. Arguments: `$ARGUMENTS` (first token = language slug, optional second token = challenge count; default 6).

Read this whole file before doing anything. The constraints come from the schema, not from convention — the validator will reject anything that drifts.

## Step 1 — resolve inputs

1. Read `tools/languages.txt`, `tools/topics.txt`, `tools/frameworks.txt`, `tools/packs.json`, and `tools/schema.ts`. These are the source of truth.
2. **Language**:
   - If `$ARGUMENTS` provides a language token, use it. Otherwise list `tools/languages.txt` to the user and ask which one.
   - If the chosen language is not in `tools/languages.txt`, ask whether to add it. If yes, append it (one slug per line, alphabetized, blank line at EOF preserved).
3. **Count**: take from `$ARGUMENTS` if present; otherwise default to 6. Cap at 10 unless the user explicitly asks for more.
4. **Pack scope**:
   - If a pack already keys into `tools/packs.json` matching the language (e.g. `python-fundamentals` for `python`), default to extending it. Confirm with the user.
   - Otherwise propose a new pack id (default `<lang>-fundamentals`), title (e.g. `Python Fundamentals`), description (one sentence), and `packVersion: "0.1.0"`. Add the entry to `tools/packs.json`.
5. **Existing content**: list `content/<language>/**/*.md` so you don't duplicate `id`s, titles, or topic angles.

## Step 2 — propose the set

Before writing any files, draft a numbered table of the planned challenges with: `id`, `title`, `category`, `difficulty`, `topic(s)`. Aim for variety:

- **Categories** (pick from): `explain` `debug` `write` `refactor` `tests` `security` `a11y` `architecture` `design`. Use at least 4 different categories across the set.
- **Difficulty mix**: roughly 50% beginner, 33% intermediate, 17% advanced. Don't make everything beginner.
- **Topics**: spread across `tools/topics.txt`. Avoid putting two challenges on the same topic unless the count > 6. If a topic you want is missing, add it to `tools/topics.txt` (one slug per line) and mention it in the proposal.
- **Real-world flavor**: each challenge should map to a thing the language is actually used for. No contrived "FizzBuzz with extra steps."

Show the table to the user briefly so they can redirect (auto mode: proceed if they don't push back within the same turn — but pause if the proposal looks weak or you need a judgment call).

## Step 3 — write each challenge file

One file per challenge at `content/<language>/<topic>/<slug>.md`. The `<slug>` matches the second half of the `id`.

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

Do **not** run `npm run build` — that writes to `dist/` and isn't needed at authoring time. CI will build on the next release tag.

## Step 5 — offer to push

After validation passes, summarize what's about to be committed (file count, pack id, allow-list edits) and ask the user:

> Push these changes? Branch name [pack/<language>-<YYYY-MM-DD>]:

Wait for an explicit yes. If the user declines or doesn't answer, stop here — they'll commit manually. If they accept:

1. Run `git status` and `git diff --stat` first so you can confirm only the expected files are staged.
2. Create the branch: `git checkout -b <branch>` (use the user's name if they supplied one, else the default).
3. Stage **only** the files this command produced — list them explicitly, do not use `git add -A` or `git add .`. Typical set:
   - `content/<language>/**/*.md` (the new challenges)
   - `tools/packs.json` (only if a new pack was added)
   - `tools/languages.txt` / `tools/topics.txt` / `tools/frameworks.txt` (only if you appended)
4. Commit with a HEREDOC message:
   ```
   git commit -m "$(cat <<'EOF'
   Add <pack-id> pack (<n> challenges)

   <one-line summary of category/difficulty spread>
   EOF
   )"
   ```
   Do not pass `--no-verify` or `-c commit.gpgsign=false`. If a hook fails, fix the issue and create a NEW commit (do not amend).
5. Push: `git push -u origin <branch>`. Do not push to `main` unless the user explicitly named `main` as the branch — and if they do, confirm once more before pushing.
6. Print the branch name and the remote URL (from `git remote get-url origin`) so the user can open a PR in the browser if they want.

## Step 6 — final summary

Report:

- Pack id and version (and whether it was new or extended)
- Files created (relative paths)
- Validation result
- Any allow-list files you appended to (`languages.txt`, `topics.txt`, `frameworks.txt`)
- Branch + commit sha if pushed; otherwise note that changes are local-only
- Reminder: bump `packVersion` in `tools/packs.json` if extending an existing pack and it ships in a release alongside meaningful content changes

## Notes

- `tools/schema.ts` mirrors `keep-sharp-dev/src/models/Challenge.ts`. Don't invent fields; if the schema rejects something, the schema is right.
- `dist/` is committed but generated — don't hand-edit it.
- One PR per coherent batch. Don't mix unrelated language packs in the same PR.
