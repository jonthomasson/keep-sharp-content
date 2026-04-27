---
id: js-fundamentals/write-deep-clone
title: 'Write a function: deepClone'
category: write
difficulty: intermediate
language: javascript
topics: [fundamentals, immutability]
tags: [recursion, structured-clone]
expectedConcepts:
  - recursive function that handles plain objects, arrays, primitives, and (at minimum) Date
  - returns primitives as-is (typeof !== 'object' || value === null)
  - recursively clones each enumerable own property of objects and each element of arrays
  - JSON.parse(JSON.stringify(x)) is a tempting one-liner but loses Dates, undefined, functions, Maps, Sets, and circular references
  - 'bonus: structuredClone is the modern built-in that handles most of these cases'
solutionArchetypes:
  - typeof checks → primitives passthrough → array recursion → plain object recursion
  - guard for Date by checking instanceof Date and returning new Date(value.getTime())
---

Write a function `deepClone(value)` that returns a structural copy of `value` such that mutating the result does not affect the original (and vice versa). At a minimum, handle:

- primitives (numbers, strings, booleans, null, undefined),
- arrays,
- plain objects,
- `Date` instances.

You do **not** need to handle circular references for this exercise.

Bonus: in 1-2 sentences, explain why `JSON.parse(JSON.stringify(value))` is a tempting shortcut and why it's wrong for at least three concrete cases.
