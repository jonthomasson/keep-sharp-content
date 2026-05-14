---
id: ts-rxjs/architecture-state-via-behaviorsubject
title: Architect a small store with BehaviorSubject
category: architecture
difficulty: intermediate
language: typescript
topics: [reactive, state-management, architecture]
tags: [rxjs, behaviorsubject, store, selectors]
starter:
  kind: single
  language: typescript
  code: |
    // Setup: npm install rxjs
    import { Observable } from 'rxjs';

    interface CartState {
      items: { id: string; qty: number; price: number }[];
      isCheckoutOpen: boolean;
    }

    // Design a small cart store. Fill in the implementation.

    class CartStore {
      // exposes:
      //   state$: Observable<CartState>          — current full state, emits on every change
      //   itemCount$: Observable<number>         — derived selector, only emits when count actually changes
      //   total$: Observable<number>             — derived selector, only emits when total actually changes
      //
      // methods:
      //   addItem(item: { id; qty; price }): void
      //   removeItem(id: string): void
      //   openCheckout(): void
      //   closeCheckout(): void
    }
expectedConcepts:
  - 'use a private BehaviorSubject<CartState> for the source of truth — BehaviorSubject (not Subject) is required so new subscribers immediately get the current value'
  - 'expose state$ as .asObservable() so external callers cannot call .next() directly — encapsulation'
  - 'all mutations go through methods that read the current value (.value or .getValue()), produce a new immutable state, and call .next(newState) — never mutate the existing items array in place'
  - 'derived selectors (itemCount$, total$) are state$.pipe(map(...), distinctUntilChanged()) — distinctUntilChanged is what makes them "only emit on change"'
  - 'why BehaviorSubject over plain Subject: late subscribers must get the current state immediately, not have to wait for the next change'
  - 'avoid emitting reference-equal-but-mutated objects from .next() — selectors compare with === by default and will not emit if the reference is unchanged'
solutionArchetypes:
  - 'private state = new BehaviorSubject<CartState>(initial); public state$ = this.state.asObservable()'
  - 'addItem produces a new items array (spread) and calls state.next({ ...state.value, items: newItems })'
  - 'itemCount$ = state$.pipe(map(s => s.items.reduce((n, i) => n + i.qty, 0)), distinctUntilChanged())'
---

Design the `CartStore` class above. Your implementation should expose the listed observables and methods, with these properties:

- The current state is always available to a new subscriber the moment it subscribes (no waiting for the next action).
- Outside callers can subscribe to state but cannot push values into it.
- `itemCount$` and `total$` only emit when their value actually changes, even if `state$` emits with the checkout flag toggled (and item count unchanged).
- Mutations produce a **new** state object — `items` is never mutated in place.

Write the class. Then briefly (1-2 sentences) explain **why a `BehaviorSubject` is required here and a plain `Subject` would not work** for the source of truth.
