---
id: csharp-fundamentals/debug-async-deadlock
title: 'Find the bug: async deadlock with .Result'
category: debug
difficulty: advanced
language: csharp
topics: [async, concurrency, fundamentals]
tags: [deadlock, synchronizationcontext]
expectedConcepts:
  - calling .Result (or .Wait()) on a Task blocks the calling thread
  - in contexts with a SynchronizationContext (classic ASP.NET, WinForms, WPF), the awaited continuation tries to resume on the same context
  - the calling thread is blocked waiting for the Task; the Task is waiting for the context's only thread — classic deadlock
  - ASP.NET Core has no SynchronizationContext, so the same code does NOT deadlock there — but it still blocks a thread-pool thread, harming throughput
  - the fix is to make the call chain async all the way (await GetAsync()), not to add ConfigureAwait(false) at every layer (that's a workaround, not a fix)
starter:
  kind: single
  language: csharp
  code: |
    // Inside a classic ASP.NET MVC controller action (not ASP.NET Core):
    public ActionResult Index()
    {
        var data = LoadAsync().Result; // <-- hangs forever in production
        return View(data);
    }

    private async Task<string> LoadAsync()
    {
        var client = new HttpClient();
        var response = await client.GetStringAsync("https://example.com");
        return response;
    }
---

The controller above hangs forever in classic ASP.NET but appears to "work" in a console app or in ASP.NET Core. Identify the bug and explain it precisely.

Your answer should:

1. Name what's happening (in two words).
2. Walk through which thread is blocked, which task is waiting, and why neither can make progress.
3. Show the corrected controller code.
4. Explain why a band-aid like `LoadAsync().ConfigureAwait(false).GetAwaiter().GetResult()` is not the right fix even when it doesn't hang.
