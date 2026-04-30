---
id: csharp-fundamentals/debug-modifying-collection-while-enumerating
title: 'Find the bug: modifying a list during iteration'
category: debug
difficulty: beginner
language: csharp
topics: [collections, fundamentals]
tags: [foreach, invalidoperationexception]
starter:
  kind: single
  language: csharp
  code: |
    public static void RemoveExpired(List<Session> sessions, DateTime cutoff)
    {
        foreach (var session in sessions)
        {
            if (session.LastSeen < cutoff)
            {
                sessions.Remove(session);
            }
        }
    }

    public record Session(string Id, DateTime LastSeen);
expectedConcepts:
  - the List<T> enumerator detects the version change and throws InvalidOperationException on the next MoveNext
  - the runtime exception message is about the collection being modified during enumeration
  - 'fix options include iterating a snapshot via ToList() or ToArray(), calling sessions.RemoveAll(predicate), or building a new filtered list'
  - RemoveAll is the most idiomatic single-call fix for this exact pattern
  - collecting into a separate to-remove list and removing after the foreach is also a valid fix
---

The method above is meant to remove every session older than `cutoff` from the list. It compiles, but it throws at runtime as soon as it actually has something to remove.

Identify the **exception type** and the root cause (be specific about why a `foreach` over `List<T>` cannot tolerate a mutating call), then propose at least **two** correct fixes. Indicate which one you would prefer in production code and why.
