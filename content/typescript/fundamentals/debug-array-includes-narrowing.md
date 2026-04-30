---
id: ts-fundamentals/debug-array-includes-narrowing
title: 'Find the bug: includes() rejects a string'
category: debug
difficulty: beginner
language: typescript
topics: [typing, fundamentals]
tags: [literal-types, as-const]
starter:
  kind: single
  language: typescript
  code: |
    const ROLES = ['admin', 'editor', 'viewer'] as const;

    function isRole(input: string): boolean {
      return ROLES.includes(input);
    }
expectedConcepts:
  - ROLES is typed as readonly admin | editor | viewer tuple because of as const
  - includes() on that tuple expects an argument of the literal union, not a generic string
  - the TS error reports that string is not assignable to the literal union of role names
  - 'fix options include widening via (ROLES as readonly string[]).includes(input), using a type predicate, or removing as const'
  - 'the better fix is a user-defined type guard with signature (x: string): x is typeof ROLES[number]'
---

The function above produces a TypeScript error on the `.includes(input)` line. Explain why TypeScript rejects it — be specific about the inferred type of `ROLES` and what `Array.prototype.includes` expects after `as const`. Then propose at least **two** ways to fix it, and indicate which fix you'd ship to production and why.
