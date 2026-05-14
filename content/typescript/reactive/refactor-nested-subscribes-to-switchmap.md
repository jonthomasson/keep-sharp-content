---
id: ts-rxjs/refactor-nested-subscribes-to-switchmap
title: Refactor nested subscribes to switchMap
category: refactor
difficulty: intermediate
language: typescript
topics: [reactive, async]
tags: [rxjs, switchmap, operators]
starter:
  kind: single
  language: typescript
  code: |
    // Setup: npm install rxjs
    import { Observable } from 'rxjs';

    declare function fetchUser(id: string): Observable<{ id: string; teamId: string }>;
    declare function fetchTeam(teamId: string): Observable<{ id: string; name: string }>;

    function loadUserTeam(userId: string, onResult: (team: { id: string; name: string }) => void) {
      fetchUser(userId).subscribe((user) => {
        fetchTeam(user.teamId).subscribe((team) => {
          onResult(team);
        });
      });
    }
expectedConcepts:
  - nested subscribes break composability — the outer stream cannot be observed, errored, or unsubscribed as a single pipeline
  - 'switchMap takes each outer value, maps it to a new inner Observable, and cancels any previous in-flight inner on a new outer emission'
  - 'the refactored function should RETURN an Observable<Team>, not take an onResult callback — the caller subscribes (or pipes it further)'
  - errors from either fetchUser or fetchTeam now propagate to the single outer subscription instead of being silently dropped on the inner
  - switchMap is the right operator here because each new userId should cancel the prior in-flight team fetch — mergeMap would race, concatMap would queue, exhaustMap would ignore
solutionArchetypes:
  - 'fetchUser(userId).pipe(switchMap(user => fetchTeam(user.teamId)))'
  - return the piped Observable directly; let the caller subscribe
---

The function above subscribes to `fetchUser`, then inside that callback subscribes to `fetchTeam`. This "callback inside callback" is the RxJS equivalent of nested promises — composability and cancellation are lost.

Refactor `loadUserTeam` to:

1. Return an `Observable<{ id: string; name: string }>` instead of taking an `onResult` callback.
2. Use `switchMap` to chain the two requests into a single pipeline.
3. Eliminate the inner `.subscribe`.

Then in 1-2 sentences, explain why `switchMap` (rather than `mergeMap`, `concatMap`, or `exhaustMap`) is the right choice when the outer source is "the user clicked or the route changed."
