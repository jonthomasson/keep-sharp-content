# Contributing a Challenge

Thanks for adding to the Keep Sharp catalog. The whole pipeline is "drop in a Markdown file, open a PR" — there's no UI, no DB, no admin tool.

## 1. Pick a pack

Each challenge belongs to exactly one pack, derived from the slash-prefix in its `id`. Existing packs are registered in [`tools/packs.json`](./tools/packs.json):

| Pack | Topic |
|---|---|
| `ts-fundamentals` | Core TypeScript |
| `js-fundamentals` | Vanilla JavaScript |
| `csharp-fundamentals` | C# language essentials |

To create a new pack, add an entry to `tools/packs.json` with a `title`, `description`, and starting `packVersion: "0.1.0"`.

## 2. Write the challenge file

One file per challenge, anywhere under `content/<lang>/<topic>/`. The filename should match the slug in the `id`. Example: `content/typescript/fundamentals/explain-readonly-vs-as-const.md`.

Every file is **YAML frontmatter + Markdown body**. The body becomes `instructions` (markdown is rendered in the webview).

Minimum viable challenge:

````markdown
---
id: <pack-id>/<slug>                  # required, lowercase + hyphens, must be unique
title: Short, human-readable title    # required, 3-120 chars
category: explain                     # one of: explain, debug, write, refactor, tests, security, a11y, architecture, design
difficulty: beginner                  # beginner | intermediate | advanced
language: typescript                  # see tools/languages.txt; use '*' only when variants[] is provided
topics: [fundamentals, async]         # 1-8 entries, each must be in tools/topics.txt
expectedConcepts:                     # 1-8 items, each ≥ 3 chars; never shown in webview
  - the rubric the AI uses to grade
  - be specific and concrete
starter:                              # optional; omit for "write from scratch" challenges
  kind: single
  language: typescript
  code: |
    function thing(x: number): number {
      return x + 1;
    }
---

The challenge instructions go here as Markdown. Lists, **bold**, `inline code`, and paragraph breaks all work in the webview.
````

### Optional fields

| Field | Purpose |
|---|---|
| `framework` | When the challenge is framework-specific (e.g. `angular`, `next`). Must be in `tools/frameworks.txt`. |
| `tags` | Free-form labels (no allow-list); useful for search. |
| `solutionArchetypes` | List of acceptable approaches when there are multiple valid solutions. Sent to the AI to widen the rubric. |
| `variants` | For language-agnostic problems. Each variant supplies its own `language` (and optionally `starter` / `expectedConcepts`). When `variants` is set, the top-level `language` should be `'*'`. |

### Multi-file starter

```yaml
starter:
  kind: multi
  files:
    - path: Component.tsx
      language: typescript
      code: |
        export function Component() { return <div /> }
    - path: Component.test.tsx
      language: typescript
      code: |
        // tests here
```

## 3. Validate locally

```bash
npm install
npm run validate
```

You'll see a count of validated challenges, or a precise list of errors. The validator is the same code CI runs.

## 4. Open a PR

CI re-runs `npm run validate`. Once it passes and a maintainer approves, your challenge ships in the next tagged release.

## Style tips

- **Be specific.** `expectedConcepts` is a rubric, not a vibe — list the things a passing answer would mention.
- **Set realistic difficulty.** "Beginner" is genuinely first-week stuff. If your challenge needs domain knowledge, mark it intermediate or advanced.
- **Keep starters small.** A 200-line file is too much to read in a webview. Aim for ≤ 30 lines unless the point of the challenge is wading through complexity.
- **Avoid trick questions.** This is a learning tool, not a hazing ritual. Reward thinking, not gotchas.
- **Don't include the answer in `instructions`.** Don't include `expectedConcepts` either — those are stripped before they reach the webview, but it's habit-forming to write rubric-y instructions, which spoil the exercise.

## Adding a new language, framework, or topic

If your challenge uses one that isn't on the allow-list, the validator will tell you exactly which file to update:

- New language → add to `tools/languages.txt`
- New framework → add to `tools/frameworks.txt`
- New topic → add to `tools/topics.txt`

Open a single PR that adds both the allow-list entry and the first challenge using it.
