---
id: csharp-fundamentals/explain-records-vs-classes
title: Explain records vs classes
category: explain
difficulty: beginner
language: csharp
topics: [typing, fundamentals]
tags: [records, equality, value-types]
starter:
  kind: single
  language: csharp
  code: |
    public class CustomerC
    {
        public string Name { get; init; } = "";
        public string Email { get; init; } = "";
    }

    public record CustomerR(string Name, string Email);

    var c1 = new CustomerC { Name = "Ada", Email = "ada@x.com" };
    var c2 = new CustomerC { Name = "Ada", Email = "ada@x.com" };
    Console.WriteLine(c1.Equals(c2)); // ?

    var r1 = new CustomerR("Ada", "ada@x.com");
    var r2 = new CustomerR("Ada", "ada@x.com");
    Console.WriteLine(r1.Equals(r2)); // ?
expectedConcepts:
  - records get value-based Equals, GetHashCode, and ToString synthesized by the compiler
  - 'classes use reference equality by default, so c1.Equals(c2) prints False while r1.Equals(r2) prints True'
  - records support nondestructive mutation via with expressions
  - 'positional record syntax generates init-only properties, a primary constructor, and Deconstruct'
  - 'records are still reference types unless declared as record struct (C# 10 and later)'
---

Look at the snippet above. In 3-5 sentences, explain:

1. What `r1.Equals(r2)` prints and why it differs from `c1.Equals(c2)`.
2. **Two** other things the C# compiler synthesizes for a `record` declaration that you do not get for a regular class.
3. When you would still reach for a regular `class` over a `record`.
