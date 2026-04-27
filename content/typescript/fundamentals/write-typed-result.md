---
id: ts-fundamentals/write-typed-result
title: 'Write a function: typed Result helper'
category: write
difficulty: intermediate
language: typescript
topics: [typing, patterns, control-flow]
tags: [discriminated-union, error-handling]
expectedConcepts:
  - Result is a discriminated union with an ok flag distinguishing success from failure
  - tryCatch wraps any sync or async function, returning Result<T, Error> instead of throwing
  - inside the function, use try/catch and await fn() to handle both sync throws and async rejections
  - the ok discriminant lets the caller narrow without type assertions
solutionArchetypes:
  - 'return a discriminated union { ok: true, value } | { ok: false, error }'
  - accept () => T | Promise<T>, await the call, return value on success or error on catch
---

Write a TypeScript helper that turns "throwing code" into "value-returning code" using a discriminated-union `Result` type. Specifically:

1. Define a generic `Result<T, E = Error>` type that is either `{ ok: true, value: T }` or `{ ok: false, error: E }`.
2. Implement `async function tryCatch<T>(fn: () => T | Promise<T>): Promise<Result<T>>` that:
   - Runs `fn()` (which may be sync or async).
   - Returns `{ ok: true, value }` on success.
   - Returns `{ ok: false, error }` (where `error` is an `Error`) on any throw or rejection.

Use it like: `const r = await tryCatch(() => JSON.parse(input)); if (r.ok) { ... } else { ... }`. No `unknown` casts in the call site.
