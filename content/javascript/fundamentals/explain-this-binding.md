---
id: js-fundamentals/explain-this-binding
title: 'Explain: why this is undefined'
category: explain
difficulty: intermediate
language: javascript
topics: [fundamentals]
tags: [this, methods, bind]
expectedConcepts:
  - method calls bind `this` to the receiver, but only when called as obj.method()
  - extracting the method into a bare function loses the receiver — `this` becomes undefined in strict mode (or the global object in sloppy mode)
  - setTimeout calls the callback as a plain function, not as counter.tick(), so `this` is no longer counter
  - fixes include arrow function wrapper, .bind(counter), or making tick an arrow-function property
starter:
  kind: single
  language: javascript
  code: |
    const counter = {
      n: 0,
      tick() {
        this.n += 1;
        console.log('count is', this.n);
      },
    };

    counter.tick();              // works: count is 1
    setTimeout(counter.tick, 0); // boom: TypeError or NaN
---

Explain in 2-4 sentences:

1. Why does `counter.tick()` work but `setTimeout(counter.tick, 0)` blow up?
2. Show **two** different ways to fix the call to `setTimeout` so it logs `count is 2`.
3. Bonus: which fix would still work if someone reassigned `counter = null` later, and why?
