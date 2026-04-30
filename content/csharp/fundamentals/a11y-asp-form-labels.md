---
id: csharp-fundamentals/a11y-asp-form-labels
title: 'Find the a11y issues: ASP.NET form without labels'
category: a11y
difficulty: beginner
language: csharp
framework: aspnet
topics: [a11y, dom]
tags: [forms, semantics, razor]
starter:
  kind: single
  language: csharp
  code: |
    @* Razor view: Views/Account/Login.cshtml *@
    <form asp-action="Login" method="post">
        <div>Email</div>
        <input asp-for="Email" type="email" />

        <div>Password</div>
        <input asp-for="Password" type="password" />

        <div onclick="this.closest('form').submit()">Sign in</div>
    </form>
expectedConcepts:
  - 'inputs have no associated <label> element — screen readers announce the field as unlabelled'
  - 'fix is <label asp-for="Email">Email</label> which renders for= pointing at the rendered input id'
  - 'the Sign in div is not a button — keyboard users cannot tab to it or activate it with Enter or Space'
  - 'replace with <button type="submit">Sign in</button> for native role, focusability, and keyboard activation'
  - 'visible text near a field is sighted-only — the programmatic association via for= is what assistive tech relies on'
---

This Razor view renders a sign-in form with several accessibility problems. List **at least three** distinct issues a keyboard or screen-reader user would encounter, then rewrite the form using the appropriate ASP.NET Core tag helpers and HTML elements.

Briefly explain (1-2 sentences) why associating a `<label>` with its `<input>` via `for=` (or via the `asp-for` label tag helper) is preferable to placing visible text near the field.
