---
id: ts-fundamentals/architecture-layered-imports
title: Diagnose a layered architecture violation
category: architecture
difficulty: advanced
language: typescript
topics: [architecture, patterns]
tags: [layering, dependency-inversion]
starter:
  kind: single
  language: typescript
  code: |
    // src/domain/Order.ts
    import { db } from '../infrastructure/db';

    export class Order {
      constructor(public id: string, public total: number) {}

      async save(): Promise<void> {
        await db.query('INSERT INTO orders (id, total) VALUES ($1, $2)', [this.id, this.total]);
      }
    }

    // src/application/checkout.ts
    import { Order } from '../domain/Order';
    export async function checkout(total: number): Promise<void> {
      const order = new Order(crypto.randomUUID(), total);
      await order.save();
    }
expectedConcepts:
  - the domain layer is importing from infrastructure — dependencies should point inward, not outward
  - Order cannot be unit-tested without a real (or heavily mocked) database connection
  - 'the standard fix introduces an OrderRepository interface in the domain layer that infrastructure implements'
  - 'the application layer composes the concrete repository with the domain entity, i.e. dependency injection'
  - 'this is the dependency inversion principle / hexagonal architecture applied — the domain owns the contract'
---

The snippet shows a domain entity (`Order`) that talks directly to a database module from the infrastructure layer. In a layered or hexagonal architecture this is an inversion-of-dependencies smell.

1. Explain which dependency rule is violated and the **concrete consequences** (testing, coupling, ability to swap the database, redeployability).
2. Sketch a refactor: show the new shape of `Order`, the **interface** that would live in the domain layer, and how `checkout` would compose them. TypeScript pseudocode is fine — the goal is the structural shape, not a runnable example.
