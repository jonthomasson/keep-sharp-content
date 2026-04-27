---
id: js-fundamentals/tests-pure-function
title: 'Identify missing tests: slugify'
category: tests
difficulty: beginner
language: javascript
topics: [testing, fundamentals]
tags: [edge-cases]
expectedConcepts:
  - empty string input
  - input that is already a valid slug (idempotence)
  - leading/trailing whitespace
  - mixed case (should lowercase)
  - consecutive non-alphanumeric runs (should collapse to a single hyphen)
  - leading/trailing hyphens after substitution (should be trimmed)
  - unicode characters (e.g. emoji or accents) — what is the expected behavior?
solutionArchetypes:
  - list 5+ untested behaviors and for each propose a one-line test case (input → expected)
---

Below is a `slugify` function and its only existing test. The function is meant to turn a free-text string into a URL-safe slug.

```js
function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// existing test:
expect(slugify('Hello World')).toBe('hello-world');
```

The single test does not exercise enough behavior. Identify **at least five** distinct behaviors of `slugify` that are not covered, and for each one propose a concrete test case as `input → expected`. Don't write the assertion library boilerplate — just the input and what the slug should be.

For at least one case, point out a behavior of the current implementation that you think is **wrong** or undefined and explain how you would resolve it.
