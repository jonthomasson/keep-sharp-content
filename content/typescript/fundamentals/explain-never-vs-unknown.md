---
id: ts-fundamentals/explain-never-vs-unknown
title: Explain never vs unknown vs any
category: explain
difficulty: beginner
language: typescript
topics: [typing, fundamentals]
tags: [top-bottom-types, narrowing]
expectedConcepts:
  - any disables type checking — assignable in both directions, no narrowing required
  - unknown is the type-safe top type — accepts any value but requires narrowing before use
  - never is the bottom type — no value inhabits it, used for impossible branches and exhaustiveness
  - 'unknown values cannot be passed where a specific type is expected without a type guard or assertion'
  - 'common use of never: return type of throw helpers and the default branch in exhaustive switches'
---

In 3-5 sentences, explain the difference between TypeScript's `any`, `unknown`, and `never`. Address:

- where each one sits in the type hierarchy (top, bottom, or escape hatch),
- what the compiler lets you do with a value of each type,
- one situation where `unknown` is preferable to `any`, and one situation where `never` is the right return type.
