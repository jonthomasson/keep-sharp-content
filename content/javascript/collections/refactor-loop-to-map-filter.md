---
id: js-fundamentals/refactor-loop-to-map-filter
title: Refactor an imperative loop to map+filter
category: refactor
difficulty: beginner
language: javascript
topics: [collections, fundamentals]
tags: [map, filter, array-methods]
starter:
  kind: single
  language: javascript
  code: |
    // Refactor this imperative loop to a chained map/filter pipeline.
    // Behavior must stay identical.

    function activeUserEmails(users) {
      const result = [];
      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        if (u.active && u.email) {
          result.push(u.email.toLowerCase());
        }
      }
      return result;
    }

    const sample = [
      { name: 'Ada', email: 'Ada@Example.com', active: true },
      { name: 'Bo',  email: null,              active: true },
      { name: 'Cai', email: 'cai@example.com', active: false },
    ];
    console.log(activeUserEmails(sample));
expectedConcepts:
  - 'use filter to drop inactive users and users without an email: users.filter(u => u.active && u.email)'
  - 'use map to project each remaining user to u.email.toLowerCase()'
  - chain in the right order — filter before map so the map only runs on items that pass
  - the refactor does not mutate users; the original loop already did not, the chain preserves that
  - 'reasonable critique: chaining walks the array twice — fine for small arrays, worth noting for very large ones (then prefer reduce or a single loop)'
solutionArchetypes:
  - 'users.filter(u => u.active && u.email).map(u => u.email.toLowerCase())'
  - 'flatMap variant: users.flatMap(u => (u.active && u.email) ? [u.email.toLowerCase()] : [])'
---

Refactor `activeUserEmails` to use a `filter` + `map` chain instead of an explicit `for` loop. The output array must be identical to the original for every input.

Then in 1-2 sentences, note one trade-off of the chained version compared to a single loop or a `reduce`.
