---
id: js-fundamentals/write-group-by
title: 'Write a function: groupBy'
category: write
difficulty: beginner
language: javascript
topics: [collections, fundamentals]
tags: [reduce, array-methods]
starter:
  kind: single
  language: javascript
  code: |
    // Write groupBy(items, keyFn) below.
    //
    // Example:
    //   const people = [
    //     { name: 'Ada', dept: 'eng' },
    //     { name: 'Bo',  dept: 'ops' },
    //     { name: 'Cai', dept: 'eng' },
    //   ];
    //   groupBy(people, p => p.dept)
    //   // => { eng: [{name:'Ada',...},{name:'Cai',...}], ops: [{name:'Bo',...}] }

    function groupBy(items, keyFn) {
      // your code here
    }

    console.log(groupBy([1, 2, 3, 4], n => (n % 2 ? 'odd' : 'even')));
expectedConcepts:
  - use reduce with an initial value of {} (the accumulator is the grouping object)
  - compute the key for each item via keyFn(item) and coerce it to a string (object keys are strings)
  - 'lazy-initialize the bucket: acc[key] = acc[key] || [], then push the item'
  - return the accumulator from the reducer
  - 'bonus: Object.groupBy(items, keyFn) is the modern built-in (ES2024) — mention if known'
solutionArchetypes:
  - 'items.reduce((acc, item) => { const k = keyFn(item); (acc[k] ||= []).push(item); return acc; }, {})'
  - for-of loop with explicit accumulator object — also valid, just less idiomatic
---

Write a function `groupBy(items, keyFn)` that returns an object whose keys are the values returned by `keyFn(item)` and whose values are arrays of the items that produced that key. Item order within each bucket should match the input order.

Use `Array.prototype.reduce` rather than a `for` loop. Don't mutate the input array.

**Bonus:** mention the modern built-in that does this for you and what version of JavaScript it landed in.
