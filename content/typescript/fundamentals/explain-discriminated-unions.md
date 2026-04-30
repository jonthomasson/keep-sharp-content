---
id: ts-fundamentals/explain-discriminated-unions
title: Explain discriminated unions
category: explain
difficulty: intermediate
language: typescript
topics: [typing, patterns]
tags: [tagged-union, narrowing]
starter:
  kind: single
  language: typescript
  code: |
    type LoadingState =
      | { status: 'idle' }
      | { status: 'loading' }
      | { status: 'success'; data: string }
      | { status: 'error'; error: Error };

    function render(s: LoadingState): string {
      switch (s.status) {
        case 'idle': return 'Click load';
        case 'loading': return 'Loading...';
        case 'success': return s.data;
        case 'error': return s.error.message;
      }
    }
expectedConcepts:
  - the literal status field is the discriminant — TypeScript narrows the union on each case
  - 'inside case success, s.data is accessible because the variant is narrowed; outside that case it would be a type error'
  - without a literal-typed discriminant, the compiler cannot tell which variant is in hand at a given branch
  - exhaustiveness can be enforced by adding a default branch that assigns s to a never-typed variable
---

Look at the `LoadingState` type and the `render` function above. In 3-5 sentences, explain:

1. What makes this a **discriminated union** rather than a plain union of object types.
2. Why the compiler allows `s.data` inside `case 'success'` but would reject it elsewhere.
3. How you would extend `render` to be checked for **exhaustiveness** — so adding a new variant to `LoadingState` later produces a compile error if `render` doesn't handle it.
