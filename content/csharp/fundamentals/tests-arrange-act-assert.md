---
id: csharp-fundamentals/tests-arrange-act-assert
title: Identify missing tests for a money formatter
category: tests
difficulty: beginner
language: csharp
topics: [testing, fundamentals]
tags: [xunit, edge-cases, naming]
starter:
  kind: single
  language: csharp
  code: |
    public static string FormatUsd(decimal amount)
    {
        if (amount < 0) return "-" + FormatUsd(-amount);
        return amount.ToString("C2", new CultureInfo("en-US"));
    }

    // Existing test (xUnit):
    [Fact]
    public void FormatUsd_PositiveDecimal_ReturnsDollarString()
    {
        Assert.Equal("$1,234.56", FormatUsd(1234.56m));
    }
expectedConcepts:
  - covers a negative amount such as -50m producing a leading minus before the dollar sign
  - covers zero producing $0.00
  - covers a whole-number value (1000m) producing $1,000.00 with a thousands separator
  - covers a small fractional value that exercises rounding to two decimals
  - 'uses descriptive test names in Method_State_ExpectedResult form so a failing test self-describes'
  - groups arrange/act/assert visibly per test or uses Theory/InlineData for parameterized cases
---

Below is the `FormatUsd` method and its only existing test. The single test does not exercise enough behavior. Identify **at least five** distinct behaviors that are not covered, and for each propose a concrete xUnit test.

You don't need to write the full assertion boilerplate for each — `FormatUsd(input) → expected` plus a short test name is enough. **Name** each test clearly so a reader can tell from the failure line what regressed.
