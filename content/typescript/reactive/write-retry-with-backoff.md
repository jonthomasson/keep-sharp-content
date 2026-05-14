---
id: ts-rxjs/write-retry-with-backoff
title: 'Write: retry with exponential backoff'
category: write
difficulty: advanced
language: typescript
topics: [reactive, async, patterns]
tags: [rxjs, retry, backoff, error-handling]
starter:
  kind: single
  language: typescript
  code: |
    // Setup: npm install rxjs
    import { Observable } from 'rxjs';

    declare function flakyHttpCall(): Observable<string>; // fails ~50% of the time with an Error

    // Build a pipeline that retries flakyHttpCall up to 3 times,
    // waiting 100ms, then 200ms, then 400ms between attempts.
    // After 3 failures, the final error should propagate to the subscriber.

    const result$: Observable<string> = /* your code here */;
expectedConcepts:
  - 'use the modern retry({ count, delay }) overload — delay is a function (error, retryIndex) => Observable that defers the next attempt'
  - 'compute the backoff as 100 * Math.pow(2, retryIndex - 1) — retryIndex is 1-based for the first retry'
  - 'use rxjs.timer(ms) inside the delay function to produce the wait observable — do NOT use setTimeout'
  - 'set count to 3 so the original attempt + 3 retries = 4 total attempts; after that the error propagates'
  - 'consider filtering which errors are retryable — e.g. only retry network/5xx, not 4xx — by throwing the error from the delay function to bail early'
solutionArchetypes:
  - 'flakyHttpCall().pipe(retry({ count: 3, delay: (_err, i) => timer(100 * Math.pow(2, i - 1)) }))'
  - 'classic retryWhen approach is also acceptable but deprecated since RxJS 7 — flag if used'
---

Implement `result$` so that:

1. `flakyHttpCall()` is invoked.
2. If it errors, retry up to **3 times** with delays of **100 ms, 200 ms, 400 ms** between attempts (exponential backoff).
3. After 3 failed retries, the final error propagates to the subscriber unchanged.
4. On a successful attempt, emit the value and complete.

Use the modern `retry({ count, delay })` operator (RxJS 7+). Briefly note what you'd add to skip retries for non-retryable errors (e.g. HTTP 4xx).
