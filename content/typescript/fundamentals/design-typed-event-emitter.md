---
id: ts-fundamentals/design-typed-event-emitter
title: Design a type-safe event emitter API
category: design
difficulty: advanced
language: typescript
topics: [typing, generics, patterns]
tags: [api-design, mapped-types]
expectedConcepts:
  - 'the emitter is generic over an event-name to payload map, e.g. E extends Record<string, unknown>'
  - 'on<K extends keyof E>(event, listener) ties the listener payload type to E[K]'
  - 'emit<K extends keyof E>(event, payload) makes a wrong-shape payload a compile-time error'
  - off and once preserve the same generic constraint so listener references stay typed at call sites
  - 'tradeoff: the internal listener storage typically widens to keyof E with a small cast; externally type-safe, internally pragmatic'
solutionArchetypes:
  - generic over a payload-map type with on/off/emit using K extends keyof E
  - 'class with a private Map<keyof E, Set<Listener>>: widen at storage, narrow at the public API'
---

Design (don't fully implement) the public TypeScript API for a type-safe event emitter. The caller defines the events and their payload shapes once, and after that:

```ts
type Events = {
  'user:login': { userId: string };
  'user:logout': void;
};

const bus = new TypedEmitter<Events>();
bus.on('user:login', (p) => p.userId);    // p inferred as { userId: string }
bus.emit('user:login', { userId: '1' });  // ok
bus.emit('user:login', { wrong: true });  // compile error
```

Show the **type signatures** for the class and its `on`, `off`, `once`, and `emit` methods (body-less sketches are fine). Then in 2-3 sentences, describe one concrete tradeoff your design makes — for example, how internal listener storage stays typed, how `void`-payload events drop the second argument, or how you handle wildcard listeners.
