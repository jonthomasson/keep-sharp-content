---
id: csharp-fundamentals/write-async-retry
title: 'Write a function: async RetryAsync helper'
category: write
difficulty: intermediate
language: csharp
topics: [async, patterns]
tags: [retry, exponential-backoff]
expectedConcepts:
  - generic Func<Task<T>> input so it works for any async return type
  - retries up to maxAttempts (typically 3) on any exception (or a configurable predicate)
  - delays between attempts using Task.Delay with exponential backoff (e.g. 100ms, 200ms, 400ms)
  - respects a CancellationToken — passes it to Task.Delay and bails out if cancelled
  - rethrows the last exception (or wraps it) once retries are exhausted
solutionArchetypes:
  - for loop from 0..maxAttempts-1, try { return await action(); } catch (Exception ex) when (i < maxAttempts - 1) { await Task.Delay(...) }
---

Write a static helper:

```csharp
public static Task<T> RetryAsync<T>(
    Func<Task<T>> action,
    int maxAttempts = 3,
    CancellationToken cancellationToken = default);
```

Behavior:

- Calls `action()` up to `maxAttempts` times.
- On any exception, waits with exponential backoff (e.g. 100ms × 2^attempt) and retries.
- Returns the result on first success.
- Rethrows the most recent exception if all attempts fail.
- Honors `cancellationToken` between attempts and during the delay.

Don't pull in Polly or any other library — this is a from-scratch exercise. Briefly note one limitation of your implementation that would matter in production.
