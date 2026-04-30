---
id: csharp-fundamentals/design-options-pattern
title: Design strongly-typed configuration with the options pattern
category: design
difficulty: advanced
language: csharp
framework: aspnet
topics: [architecture, patterns]
tags: [options, configuration, validation]
expectedConcepts:
  - 'defines a POCO options class (e.g. EmailOptions) with one property per configuration key'
  - 'registers via services.Configure<EmailOptions>(builder.Configuration.GetSection("Email")) so values flow from appsettings.json, env vars, or other providers'
  - 'consumers inject IOptions<T>, IOptionsSnapshot<T>, or IOptionsMonitor<T> rather than IConfiguration directly'
  - 'adds DataAnnotations validation and chains .ValidateDataAnnotations().ValidateOnStart() so misconfiguration fails fast at boot rather than at first use'
  - 'separates the source of configuration from consumers — switching providers does not require touching EmailSender'
solutionArchetypes:
  - POCO options class plus services.Configure plus IOptions injection plus ValidateDataAnnotations and ValidateOnStart
  - 'use IOptionsSnapshot<T> for scoped/per-request reload, IOptionsMonitor<T> when you need change notifications'
---

Design the public shape of an ASP.NET Core feature that needs three pieces of email configuration: SMTP host, SMTP port, and a from-address. Use the **options pattern** — no `IConfiguration` injection in the consuming services.

Show:

1. The POCO options class with appropriate validation attributes.
2. The DI registration in `Program.cs`, including fail-fast validation at startup.
3. A trivial `EmailSender` class that consumes the typed options.
4. Briefly explain the difference between `IOptions<T>`, `IOptionsSnapshot<T>`, and `IOptionsMonitor<T>` and which one your `EmailSender` should use.
