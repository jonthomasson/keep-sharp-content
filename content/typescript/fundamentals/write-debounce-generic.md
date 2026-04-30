---
id: ts-fundamentals/write-debounce-generic
title: 'Write a function: typed debounce'
category: write
difficulty: intermediate
language: typescript
topics: [generics, performance]
tags: [higher-order, timing]
expectedConcepts:
  - generic over the wrapped function's parameter tuple, e.g. Args extends unknown[]
  - returned function preserves the original parameter types — no any in the public signature
  - uses setTimeout/clearTimeout to reset the pending call on every invocation
  - 'return type of the wrapper is (...args: Args) => void since debounced calls cannot synchronously return the original result'
  - a cancel/flush method or returning the timer is acceptable but not required
solutionArchetypes:
  - 'generic signature: (fn, ms) => (...args) => void with Args extends unknown[]'
  - close over a NodeJS.Timeout / number handle, clear it at the top of each call, then schedule a new one
---

Write `debounce`, a generic helper that wraps a function so it only runs after `ms` milliseconds have passed without it being called again.

Requirements:

- The signature must preserve the wrapped function's parameter types — `debounce((q: string) => ...)` returns a function that takes a `string`, not `any`.
- Each call resets the timer.
- The wrapped function returns `void` (don't try to plumb back an async result).

Show the implementation and a small example using it on a `(query: string) => void` search handler. Briefly note what `this` binding looks like for your version (callers, classes, etc.).
