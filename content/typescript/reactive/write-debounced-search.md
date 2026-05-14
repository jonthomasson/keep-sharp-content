---
id: ts-rxjs/write-debounced-search
title: 'Write a debounced search stream'
category: write
difficulty: beginner
language: typescript
topics: [reactive, async]
tags: [rxjs, debounceTime, switchMap, distinctUntilChanged]
starter:
  kind: single
  language: typescript
  code: |
    // Setup: npm install rxjs
    import { Observable } from 'rxjs';

    // Given:
    declare const keystrokes$: Observable<string>; // emits the current input value on every keystroke
    declare function searchApi(q: string): Observable<string[]>; // returns search results

    // Build: results$ — emits the search results for the latest user input,
    // but only fires the API call after the user pauses typing,
    // and only if the query actually changed.

    const results$: Observable<string[]> = /* your code here */;
expectedConcepts:
  - 'debounceTime(N) waits for N ms of silence before forwarding the latest value — typical UI value is 250–400 ms'
  - distinctUntilChanged drops duplicate consecutive emissions so identical queries (e.g. user types and erases the same char) do not re-fire the API
  - switchMap maps each query to a fresh searchApi observable AND cancels any in-flight previous request — critical for search-as-you-type to avoid out-of-order results
  - usually trim the query and filter out empty strings before the switchMap, or short-circuit to of([]) in the switchMap to avoid hammering the API with empty queries
  - the order of operators matters — debounce before distinctUntilChanged before switchMap is the canonical pipeline
solutionArchetypes:
  - 'keystrokes$.pipe(debounceTime(300), distinctUntilChanged(), switchMap(q => q.trim() ? searchApi(q.trim()) : of([])))'
---

Build `results$` from the given `keystrokes$` and `searchApi` so that it behaves like a normal search-as-you-type box:

- Only fire `searchApi` after the user pauses typing for ~300 ms.
- Don't re-fire if the (trimmed) query is identical to the previous one.
- If the user keeps typing, the *previous* in-flight request should be cancelled, not awaited.
- An empty query should emit `[]` without hitting the API.

Use `pipe` with the appropriate RxJS operators. Briefly: what would go wrong if you used `mergeMap` instead of `switchMap` here?
