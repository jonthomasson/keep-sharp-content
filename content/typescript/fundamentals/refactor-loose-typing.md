---
id: ts-fundamentals/refactor-loose-typing
title: Refactor away from any
category: refactor
difficulty: intermediate
language: typescript
topics: [typing, patterns]
tags: [generics, narrowing]
expectedConcepts:
  - replace any with a generic parameter so the return type follows the input type
  - the function should be generic over the array element type T
  - use a type predicate or a narrower constraint instead of any
  - the resulting signature lets callers get back a typed array without casting
starter:
  kind: single
  language: typescript
  code: |
    // Returns the elements of `items` for which `predicate` returns true.
    function pickWhere(items: any[], predicate: (item: any) => boolean): any[] {
      const out: any[] = [];
      for (const item of items) {
        if (predicate(item)) out.push(item);
      }
      return out;
    }

    // Caller has to cast — bad:
    const numbers = pickWhere([1, 2, 3, 'x'], (n) => typeof n === 'number') as number[];
---

Refactor `pickWhere` so it has a precise type signature and the caller does not need to cast. Specifically:

- Make it generic so the return type matches the element type of `items`.
- Bonus: support a **type predicate** signature so that `pickWhere([1, 2, 'x'], (n): n is number => typeof n === 'number')` narrows the result to `number[]` automatically.

Show the updated signature and body, and rewrite the caller without the `as number[]` cast.
