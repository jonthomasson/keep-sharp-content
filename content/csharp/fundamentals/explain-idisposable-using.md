---
id: csharp-fundamentals/explain-idisposable-using
title: 'Explain: IDisposable and the using statement'
category: explain
difficulty: intermediate
language: csharp
topics: [fundamentals, memory]
tags: [resource-management, idisposable]
expectedConcepts:
  - IDisposable signals "this type holds an unmanaged or scoped resource that needs deterministic cleanup"
  - using compiles to a try/finally where Dispose() is called even if an exception is thrown
  - GC alone is not sufficient because finalizers run non-deterministically and never for managed-only resources like locks or transactions
  - the C# 8 using declaration (`using var x = ...`) scopes Dispose to the enclosing block
  - common dispose-required types include FileStream, SqlConnection, HttpClient (with caveats), CancellationTokenSource
starter:
  kind: single
  language: csharp
  code: |
    // Three ways to use a FileStream:

    // (1) raw — leaks on exception:
    var fs1 = new FileStream("a.txt", FileMode.Open);
    var b1 = new byte[16];
    fs1.Read(b1, 0, 16);
    fs1.Dispose();

    // (2) classic using block:
    using (var fs2 = new FileStream("a.txt", FileMode.Open))
    {
        var b2 = new byte[16];
        fs2.Read(b2, 0, 16);
    }

    // (3) C# 8 using declaration:
    using var fs3 = new FileStream("a.txt", FileMode.Open);
    var b3 = new byte[16];
    fs3.Read(b3, 0, 16);
---

In 3-5 sentences, explain:

1. What problem `IDisposable` solves that the garbage collector does not.
2. Why version (1) is wrong even though it calls `Dispose()`.
3. The practical difference between version (2) and version (3).
