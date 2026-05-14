---
id: ts-rxjs/explain-cold-vs-hot
title: 'Explain: cold vs hot observables'
category: explain
difficulty: beginner
language: typescript
topics: [reactive, fundamentals]
tags: [rxjs, observables, multicasting]
expectedConcepts:
  - cold observables produce a fresh execution per subscriber — each subscriber gets its own values from the start (e.g. http.get, of, interval before share)
  - hot observables share a single underlying execution among all subscribers — late subscribers miss earlier values (e.g. Subject, fromEvent on a DOM node)
  - the cold-to-hot conversion is multicasting, typically via share(), shareReplay(), or wrapping in a Subject
  - implication for HTTP calls — re-subscribing to a cold http observable re-fires the request, which is usually NOT what you want for a "load once and reuse" flow
  - 'shareReplay({ bufferSize: 1, refCount: true }) is the common idiom for "make an HTTP observable hot but unsubscribe-clean"'
---

In 3-5 sentences, explain the difference between **cold** and **hot** observables in RxJS:

1. What changes from the subscriber's perspective when you subscribe to a cold observable twice vs. a hot one?
2. Give one concrete RxJS source for each (cold and hot).
3. How do you convert a cold observable into a hot one, and what's the typical operator + config you'd reach for in a "fetch once, share with many subscribers, clean up when nobody's listening" scenario?
