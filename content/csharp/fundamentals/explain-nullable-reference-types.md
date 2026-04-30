---
id: csharp-fundamentals/explain-nullable-reference-types
title: Explain nullable reference types
category: explain
difficulty: intermediate
language: csharp
topics: [typing, fundamentals]
tags: [nullability, nrt]
starter:
  kind: single
  language: csharp
  code: |
    #nullable enable

    public string FullName(Customer c)
    {
        return c.MiddleName + " " + c.LastName;
    }

    public class Customer
    {
        public string FirstName { get; set; } = "";
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = "";
    }
expectedConcepts:
  - '#nullable enable opts the file into nullable reference type analysis with CS86xx warnings'
  - 'string and string? are different at compile time — string? is a "may be null" annotation the compiler propagates'
  - 'the compiler warns inside FullName because c.MiddleName is string? being concatenated where a non-null reference was expected'
  - the runtime CLR has no notion of nullable vs non-nullable strings — the entire feature is compile-time analysis
  - 'fix options include null-coalescing (c.MiddleName ?? string.Empty), a null-check guard, or the null-forgiving ! operator as a last resort'
---

The snippet has `#nullable enable` and a `MiddleName` declared as `string?`. In 3-5 sentences, explain:

1. What `string?` adds to the type system that plain `string` does not.
2. Where the compiler will emit a warning inside `FullName` and what that warning is telling you.
3. The most appropriate fix to make `FullName` warning-free, and what `!` (the null-forgiving operator) would do if you used it instead.
