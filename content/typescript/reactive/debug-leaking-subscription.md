---
id: ts-rxjs/debug-leaking-subscription
title: 'Find the bug: leaking subscription in a component'
category: debug
difficulty: intermediate
language: typescript
topics: [reactive, memory]
tags: [rxjs, unsubscribe, takeUntil, lifecycle]
starter:
  kind: single
  language: typescript
  code: |
    // Setup: npm install rxjs
    import { interval, Subscription } from 'rxjs';

    // Imagine this is a UI component class. It "mounts" via init() and "unmounts" via destroy().
    class TickerWidget {
      private currentTick = 0;

      init() {
        // poll every second forever
        interval(1000).subscribe((n) => {
          this.currentTick = n;
          console.log('tick', n);
        });
      }

      destroy() {
        // teardown — but the subscription above is still running
      }
    }

    const w = new TickerWidget();
    w.init();
    setTimeout(() => w.destroy(), 3500);
    // ticks keep logging after destroy() — leak.
expectedConcepts:
  - 'the bug: subscribe(...) returns a Subscription, but it is discarded — destroy() has no handle to unsubscribe'
  - the underlying interval keeps emitting forever, the closure keeps the component alive, and listeners keep firing — classic leak that scales with mount/unmount churn
  - 'fix option 1: store the Subscription on the instance and call .unsubscribe() in destroy()'
  - 'fix option 2: use takeUntil with a destroy$ Subject — pipe the source through takeUntil(this.destroy$), then in destroy() call this.destroy$.next() and .complete()'
  - 'fix option 3: an Subscription "parent" that .add()s children — single .unsubscribe() in destroy() tears them all down'
  - takeUntil is preferred when there are many streams to manage in the same component because the cleanup is uniform
solutionArchetypes:
  - 'store sub in this.sub = interval(1000).subscribe(...); destroy() calls this.sub?.unsubscribe()'
  - 'use a destroy$ = new Subject<void>() — interval(1000).pipe(takeUntil(this.destroy$)).subscribe(...) — destroy() emits and completes destroy$'
---

The `TickerWidget` above leaks: after `destroy()` runs, the `interval` keeps emitting and `currentTick` keeps updating, and the component is held in memory by the subscription closure.

1. Explain in 1-2 sentences why the leak happens — what RxJS rule was broken?
2. Show the fix using `takeUntil` + a `destroy$` `Subject`. Wire it into `init()` and `destroy()` properly.
3. In 1 sentence: when would you prefer manually storing the `Subscription` and calling `.unsubscribe()` instead of the `takeUntil` pattern?
