---
id: ts-fundamentals/explain-readonly-vs-as-const
title: Explain readonly vs as const
category: explain
difficulty: intermediate
language: typescript
topics: [typing, immutability]
tags: [literal-types, tuples]
expectedConcepts:
  - readonly is a property modifier (compile-time only) that forbids reassignment of that property
  - as const narrows literal types AND makes the value deeply readonly
  - neither one changes runtime behavior — the underlying JS object is still mutable
  - PERMISSIONS becomes the readonly tuple type readonly ["read", "write", "admin"] not string[]
  - 'common use: as const for tuples and config literals; readonly for properties and parameters'
starter:
  kind: single
  language: typescript
  code: |
    interface User {
      readonly id: string;
      name: string;
    }

    const PERMISSIONS = ['read', 'write', 'admin'] as const;
---

In 3-4 sentences, explain the difference between the `readonly` modifier and the `as const` assertion in TypeScript. Use the snippet above as a reference. Specifically address:

- what each one changes about the **type** vs the **runtime value**,
- when you would reach for one over the other,
- and what the inferred type of `PERMISSIONS` is after `as const` (compared to without it).
