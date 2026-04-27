---
id: js-fundamentals/refactor-callback-pyramid
title: Refactor a callback pyramid to async/await
category: refactor
difficulty: intermediate
language: javascript
topics: [async, patterns]
tags: [callbacks, promises]
expectedConcepts:
  - convert each callback-style API to a Promise (util.promisify or hand-wrapped) and await each step
  - the refactored function is async and returns a Promise that resolves with the final result
  - errors propagate naturally through await — no per-step if(err) check needed
  - optional try/catch only when you need to add context, otherwise let the rejection bubble
starter:
  kind: single
  language: javascript
  code: |
    function loadDashboard(userId, cb) {
      getUser(userId, (err, user) => {
        if (err) return cb(err);
        getTeams(user.id, (err, teams) => {
          if (err) return cb(err);
          getMetrics(teams[0].id, (err, metrics) => {
            if (err) return cb(err);
            cb(null, { user, teams, metrics });
          });
        });
      });
    }
---

Rewrite `loadDashboard` using `async`/`await`. Assume promisified versions of `getUser`, `getTeams`, and `getMetrics` are available (or that you can `util.promisify` them). Preserve the original behavior:

- the result is `{ user, teams, metrics }`,
- any error from any step propagates to the caller,
- `getMetrics` is only called once `getTeams` resolves with at least one team.

Briefly note one advantage of the async/await version beyond "it's shorter."
