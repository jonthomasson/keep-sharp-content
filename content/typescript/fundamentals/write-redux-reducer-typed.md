---
id: ts-fundamentals/write-redux-reducer-typed
title: 'Write a function: typed cart reducer'
category: write
difficulty: intermediate
language: typescript
topics: [state-management, typing]
tags: [discriminated-union, reducer]
starter:
  kind: single
  language: typescript
  code: |
    interface CartState {
      items: { sku: string; qty: number }[];
      couponCode: string | null;
    }

    // Implement cartReducer for these actions:
    //   - ADD_ITEM     payload: { sku: string; qty: number }
    //   - REMOVE_ITEM  payload: { sku: string }
    //   - APPLY_COUPON payload: { code: string }
    //   - CLEAR        no payload
expectedConcepts:
  - define an Action type as a discriminated union with a literal type field per variant
  - 'reducer signature is (state, action) => CartState — pure, no mutation of the input state or its arrays'
  - switching on action.type narrows the payload so each case sees the correct fields
  - default branch returns state unchanged or asserts exhaustiveness via an assertNever helper
  - ADD_ITEM merges with an existing line item by sku rather than pushing a duplicate row
solutionArchetypes:
  - 'discriminated union Action plus switch(action.type), each case returning a fresh state object'
  - extract per-action helpers (addItem, removeItem) for clarity once the reducer grows past a few cases
---

Implement `cartReducer` for the state and actions described in the starter. Constraints:

- Define an `Action` type as a **discriminated union** — no `any` for the payload.
- The reducer must be **pure**: no mutation of `state`, its `items` array, or any nested object.
- For `ADD_ITEM`, if a line for that `sku` already exists, **increase its qty** instead of pushing a duplicate row.
- For `CLEAR`, reset to a fresh empty cart (`items: []`, `couponCode: null`).

Show both the `Action` union and the reducer body. A short example dispatch would be a nice touch but is not required.
