---
id: js-fundamentals/tests-pure-pipeline
title: 'Identify missing tests: sort+filter+reduce pipeline'
category: tests
difficulty: intermediate
language: javascript
topics: [collections, testing]
tags: [sort, reduce, array-methods, edge-cases]
expectedConcepts:
  - empty input array (should return 0 or whatever the identity is for the reduce step)
  - all items filtered out (e.g. every order is below the threshold) — same identity case
  - 'sort mutates in place: confirm the caller-passed array is not mutated (use a defensive [...orders].sort(...))'
  - sort comparator stability — if two orders have equal totals, their relative order should be deterministic (modern engines guarantee stable sort)
  - duplicate values in the sort key — does the top-N still return N items, or fewer due to dedupe? clarify expectation
  - 'numeric vs lexicographic sort: .sort() without a comparator sorts as strings — [10, 2, 1].sort() is [1, 10, 2]. Always pass (a,b) => a - b for numbers'
  - 'currency math: prices in cents (integers), not floats — 0.1 + 0.2 !== 0.3 in JS'
solutionArchetypes:
  - list 5+ untested behaviors and for each propose a one-line test case (input → expected) — note which currently pass and which would expose a bug
---

Below is a `topSpenders` function and its only existing test. The function is meant to return the total revenue from the top-3 most expensive orders (by `total`), filtered to a single region.

```js
function topSpenders(orders, region) {
  return orders
    .filter(o => o.region === region)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .reduce((sum, o) => sum + o.total, 0);
}

// existing test:
const orders = [
  { region: 'us', total: 50 },
  { region: 'us', total: 30 },
  { region: 'eu', total: 100 },
  { region: 'us', total: 80 },
];
expect(topSpenders(orders, 'us')).toBe(160); // 80 + 50 + 30
```

The single test does not exercise enough behavior. Identify **at least five** distinct behaviors of this pipeline that are not covered. For each, propose a concrete test case as `input → expected`. For at least one case, point out a behavior that you think is **wrong**, surprising, or would bite a caller — and explain how you would resolve it.

Don't write the assertion library boilerplate — just `input → expected` and a one-line note.
