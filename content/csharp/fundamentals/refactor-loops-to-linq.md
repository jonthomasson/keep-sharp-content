---
id: csharp-fundamentals/refactor-loops-to-linq
title: Refactor imperative loops to LINQ
category: refactor
difficulty: intermediate
language: csharp
topics: [collections, patterns]
tags: [linq, immutability]
starter:
  kind: single
  language: csharp
  code: |
    public static List<string> ActiveCustomerEmails(IEnumerable<Customer> customers)
    {
        var result = new List<string>();
        foreach (var c in customers)
        {
            if (c.IsActive)
            {
                if (!result.Contains(c.Email))
                {
                    result.Add(c.Email);
                }
            }
        }
        result.Sort();
        return result;
    }

    public record Customer(string Name, string Email, bool IsActive);
expectedConcepts:
  - filters with Where(c => c.IsActive)
  - projects with Select(c => c.Email)
  - dedupes with Distinct (or GroupBy when the dedupe key differs from the element)
  - sorts with OrderBy(e => e)
  - 'materializes once at the end with ToList — LINQ chains are deferred until enumerated'
  - the chained version reads top-down as a data pipeline and is equivalent in behavior to the loop
solutionArchetypes:
  - customers.Where filter then Select projection then Distinct then OrderBy then ToList
---

Refactor `ActiveCustomerEmails` to a single LINQ chain that produces the same result: emails of active customers, deduplicated, sorted ascending.

Show the rewritten method, then briefly (1-2 sentences) note one concrete tradeoff between the LINQ version and the imperative version — readability, debuggability, allocation, or performance for a particular input size.
