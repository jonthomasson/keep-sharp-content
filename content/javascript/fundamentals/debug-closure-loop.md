---
id: js-fundamentals/debug-closure-loop
title: 'Find the bug: closure-in-loop with var'
category: debug
difficulty: beginner
language: javascript
topics: [fundamentals, control-flow]
tags: [closures, var-vs-let]
expectedConcepts:
  - var has function scope, not block scope, so all callbacks close over the SAME i
  - by the time the timeouts fire, the loop has finished and i === 3
  - all three callbacks log 3, not 0/1/2
  - the simplest fix is to change var to let, which gives each iteration its own binding
  - alternative fixes include an IIFE per iteration or .forEach which gives each callback its own parameter
starter:
  kind: single
  language: javascript
  code: |
    function scheduleLogs() {
      for (var i = 0; i < 3; i++) {
        setTimeout(() => console.log('i =', i), 0);
      }
    }

    scheduleLogs();
    // expected: i = 0, i = 1, i = 2
    // actual:   ?
---

The function above schedules three logs and the author expected `0`, `1`, `2`. Identify the bug, explain why it happens (in terms of how `var` and the closure interact), and write the corrected version. Show **two** different fixes if you can, and say which you'd prefer in a modern codebase.
