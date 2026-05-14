---
id: js-fundamentals/debug-reduce-initial-value
title: 'Find the bug: reduce without an initial value'
category: debug
difficulty: intermediate
language: javascript
topics: [collections, fundamentals]
tags: [reduce, array-methods, edge-cases]
starter:
  kind: single
  language: javascript
  code: |
    // sumPrices returns the total of all prices in the cart.
    // It works for non-empty carts but blows up for an empty cart.

    function sumPrices(cart) {
      return cart.reduce((acc, item) => acc + item.price);
    }

    console.log(sumPrices([{ price: 5 }, { price: 7 }])); // 12, fine
    console.log(sumPrices([]));                            // TypeError: Reduce of empty array with no initial value
expectedConcepts:
  - without an initial value, reduce uses the first element as the accumulator and starts from index 1
  - on an empty array with no initial value, reduce throws "Reduce of empty array with no initial value"
  - on a one-element array, the reducer never runs — acc is just cart[0] (the item object), not a number
  - 'the fix: pass an initial value of 0 — cart.reduce((acc, item) => acc + item.price, 0)'
  - 'with the initial value, acc is correctly typed as number from the first call and empty arrays return 0'
solutionArchetypes:
  - 'add the initial value: cart.reduce((acc, item) => acc + item.price, 0)'
  - 'equivalent: cart.map(i => i.price).reduce((a, b) => a + b, 0)'
---

The `sumPrices` function above works on non-empty carts but throws on an empty cart, and would silently return the wrong thing (the first item *object*, not a number) on a one-element cart.

Explain why both failures happen — referencing what `reduce` does when no initial value is passed — and write the corrected version. Briefly: why is passing an explicit `0` the right fix here?
