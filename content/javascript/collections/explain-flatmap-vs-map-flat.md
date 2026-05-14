---
id: js-fundamentals/explain-flatmap-vs-map-flat
title: 'Explain: flatMap vs map().flat()'
category: explain
difficulty: beginner
language: javascript
topics: [collections, fundamentals]
tags: [flatmap, flat, array-methods]
expectedConcepts:
  - flatMap(fn) is equivalent in result to map(fn).flat(1) — flattens exactly one level
  - flatMap is a single pass; map().flat() walks the array twice (once to map, once to flatten)
  - 'flatMap supports a useful "map and filter" trick: return [value] to keep, return [] to drop'
  - flat() takes a depth argument (default 1, Infinity flattens all the way) — flatMap does NOT, it is always depth 1
  - both create a new array — they do not mutate the input
---

In 2-4 sentences, explain the relationship between `flatMap(fn)` and `map(fn).flat()`:

1. When are they equivalent, and when do they diverge (think: depth)?
2. What's a real reason to prefer `flatMap` over `map().flat()` beyond style?
3. Show a one-liner that uses `flatMap` to do "map and filter at the same time" — and explain why that idiom works.
