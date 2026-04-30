---
id: csharp-fundamentals/debug-equality-comparison
title: 'Find the bug: HashSet contains duplicates'
category: debug
difficulty: intermediate
language: csharp
topics: [typing, fundamentals]
tags: [equality, gethashcode]
starter:
  kind: single
  language: csharp
  code: |
    public class Point
    {
        public int X { get; }
        public int Y { get; }
        public Point(int x, int y) { X = x; Y = y; }
    }

    var set = new HashSet<Point>();
    set.Add(new Point(1, 2));
    set.Add(new Point(1, 2));
    Console.WriteLine(set.Count); // expected 1, prints 2
expectedConcepts:
  - HashSet<T> uses GetHashCode and Equals to detect duplicates and both come from object by default
  - object.Equals is reference equality, so two distinct Point instances are never equal even with identical X and Y
  - 'fix: override Equals(object?) and GetHashCode together — they must be consistent so equal objects produce equal hashes'
  - 'converting Point to a record (record Point(int X, int Y)) gives value equality automatically and is the smallest correct fix'
  - 'implementing IEquatable<Point> avoids boxing on the equality path because HashSet probes for it'
---

The snippet creates a `HashSet<Point>` and adds the "same" point twice but ends up with `Count == 2`. Explain what is happening at the type-system level — be specific about which methods `HashSet<T>` calls and what those methods do for a default `class`.

Then propose at least **two** ways to fix it. Indicate which one you would ship to production code and why.
