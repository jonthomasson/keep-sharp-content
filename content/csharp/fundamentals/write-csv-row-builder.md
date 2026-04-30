---
id: csharp-fundamentals/write-csv-row-builder
title: 'Write a function: build a CSV row efficiently'
category: write
difficulty: beginner
language: csharp
topics: [performance, fundamentals]
tags: [stringbuilder, immutability]
expectedConcepts:
  - uses StringBuilder rather than string concatenation in a loop
  - 'reason: strings are immutable in .NET, so += inside a loop allocates a new string each iteration (quadratic total work)'
  - separates fields with a single comma and produces no trailing comma
  - quotes fields that contain a comma, double-quote, or newline by wrapping in double-quotes and doubling internal quotes
  - 'string.Join with a Select-and-escape projection is acceptable for the simple case; StringBuilder is the natural choice when escaping is needed'
solutionArchetypes:
  - foreach over fields with StringBuilder.Append, comma between iterations, escape per field
  - 'string.Join("," , values.Select(Escape)) where Escape returns the field unchanged or wrapped + doubled'
---

Write `BuildCsvRow(IReadOnlyList<string> fields)` that returns a single CSV row.

Requirements:

- Fields are separated by commas; no trailing comma.
- A field containing a comma, double-quote, or newline must be wrapped in double-quotes; any embedded double-quote must be doubled (`Hi, "Ada"` becomes `"Hi, ""Ada"""`).
- The method may be called with hundreds of fields per row — avoid quadratic allocation in the field loop.

Show the implementation and briefly note (1-2 sentences) why a naive `result += field + ","` inside a `foreach` would be the wrong approach.
