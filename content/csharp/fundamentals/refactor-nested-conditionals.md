---
id: csharp-fundamentals/refactor-nested-conditionals
title: Refactor nested conditionals with guard clauses
category: refactor
difficulty: beginner
language: csharp
topics: [patterns, fundamentals]
tags: [guard-clauses, early-return]
expectedConcepts:
  - replace nested ifs with early-return guard clauses
  - the happy path becomes a single, un-indented flow at the bottom of the method
  - validation/short-circuit conditions move to the top, each with its own return
  - the refactored method is easier to scan and easier to add new validations to
  - bonus — the result is a candidate for switch expressions or pattern matching for the success cases
starter:
  kind: single
  language: csharp
  code: |
    public static decimal CalculateDiscount(Order order)
    {
        if (order != null)
        {
            if (order.Items.Count > 0)
            {
                if (order.Customer.IsActive)
                {
                    if (order.Total > 100)
                    {
                        return order.Total * 0.10m;
                    }
                    else
                    {
                        return 0m;
                    }
                }
                else
                {
                    return 0m;
                }
            }
            else
            {
                return 0m;
            }
        }
        else
        {
            throw new ArgumentNullException(nameof(order));
        }
    }
---

Refactor `CalculateDiscount` using **guard clauses**: early returns for the rejection cases and a single un-indented happy path at the bottom. The behavior must be identical:

- `null` order → `ArgumentNullException`,
- empty items → `0m`,
- inactive customer → `0m`,
- total ≤ 100 → `0m`,
- otherwise → 10% of total.

Briefly explain why the guard-clause version is easier to extend (e.g. when product asks you to add a "VIP customer always gets 15%" rule).
