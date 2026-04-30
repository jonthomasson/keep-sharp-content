---
id: ts-fundamentals/refactor-promise-then-to-async
title: Refactor .then() chain to async/await
category: refactor
difficulty: beginner
language: typescript
topics: [async, fundamentals]
tags: [promises, async-await]
starter:
  kind: single
  language: typescript
  code: |
    interface User { id: string; name: string }
    interface Order { id: string; total: number }

    declare function fetchUser(id: string): Promise<User>;
    declare function fetchOrders(userId: string): Promise<Order[]>;

    function loadUserDashboard(userId: string): Promise<{ user: User; orders: Order[] }> {
      return fetchUser(userId).then((user) => {
        return fetchOrders(user.id).then((orders) => {
          return { user, orders };
        });
      });
    }
expectedConcepts:
  - convert to an async function and use await on each Promise
  - rejection handling becomes implicit via try/catch or simple propagation — no nested .catch needed
  - the second fetch depends on the first, so the awaits stay sequential (not Promise.all)
  - 'the public return type Promise<{ user; orders }> is unchanged because async returns are auto-wrapped'
---

Refactor `loadUserDashboard` to use `async`/`await` instead of nested `.then()` callbacks. Keep behavior identical — including the order of the two network calls.

Then in 1-2 sentences, describe what changes about **error propagation** between the original style and the refactored version (e.g. what a caller would have to write to handle a failure).
