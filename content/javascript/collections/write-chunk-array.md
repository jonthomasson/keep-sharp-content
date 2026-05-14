---
id: js-fundamentals/write-chunk-array
title: 'Write a function: chunk(arr, size)'
category: write
difficulty: intermediate
language: javascript
topics: [collections, fundamentals]
tags: [slice, array-methods]
starter:
  kind: single
  language: javascript
  code: |
    // Write chunk(arr, size) below.
    //
    // chunk([1,2,3,4,5], 2)  => [[1,2], [3,4], [5]]
    // chunk([1,2,3,4],   2)  => [[1,2], [3,4]]
    // chunk([],          3)  => []
    // chunk([1,2,3],     0)  => throw or return [] (your call — justify in comments)

    function chunk(arr, size) {
      // your code here
    }

    console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3));
expectedConcepts:
  - iterate by stepping through indices in increments of size and use arr.slice(i, i + size) for each chunk
  - the final chunk may be shorter than size — that is expected, not an edge case to special-case
  - 'guard against size <= 0: either throw or return [] (defend the choice — infinite loop otherwise)'
  - 'idiomatic Array.from variant: Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))'
  - do not mutate the input array — slice already returns a new sub-array, so this falls out for free
solutionArchetypes:
  - 'for loop: for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))'
  - 'Array.from with length = ceil(arr.length / size), mapping each index to arr.slice(i*size, i*size+size)'
  - 'reduce: ((acc, _, i) => i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc) — works but allocates more'
---

Write a function `chunk(arr, size)` that splits `arr` into an array of arrays where each sub-array has at most `size` elements. The final sub-array may be shorter than `size` if the input length doesn't divide evenly.

- `chunk([1,2,3,4,5], 2)` → `[[1,2], [3,4], [5]]`
- `chunk([], 3)` → `[]`
- Decide what to do when `size <= 0`. Defend your choice in a one-line comment.

Don't mutate the input array. Solve it without a third-party library.
