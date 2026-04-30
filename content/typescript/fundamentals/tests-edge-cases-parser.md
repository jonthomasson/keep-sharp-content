---
id: ts-fundamentals/tests-edge-cases-parser
title: Test edge cases for a CSV cell parser
category: tests
difficulty: beginner
language: typescript
topics: [testing, fundamentals]
tags: [unit-tests, edge-cases]
starter:
  kind: single
  language: typescript
  code: |
    // Trims whitespace, unwraps surrounding double-quotes, and treats two consecutive
    // double-quotes inside a quoted value as one literal double-quote.
    export function parseCell(raw: string): string {
      const trimmed = raw.trim();
      if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1).replace(/""/g, '"');
      }
      return trimmed;
    }
expectedConcepts:
  - covers the happy path — a plain word with surrounding whitespace
  - covers a quoted value where leading/trailing spaces inside the quotes are preserved
  - covers escaped double-quotes inside a quoted value collapsing two doubles into one
  - covers an empty string and a single-character non-quoted input
  - uses descriptive test names so a failing run names the broken behavior, not just the input
---

Write a focused suite of unit tests (Jest or Vitest style — `describe`/`it`/`expect`) for `parseCell`. Aim for **5-7 tests** total.

Each test should target a distinct behavior described in the comment — don't write multiple tests that exercise the same code path. Name each test so a reader can tell from the failure line alone exactly which behavior regressed.
