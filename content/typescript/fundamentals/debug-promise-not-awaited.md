---
id: ts-fundamentals/debug-promise-not-awaited
title: 'Find the bug: forgotten await'
category: debug
difficulty: beginner
language: typescript
topics: [async, fundamentals]
tags: [promises]
expectedConcepts:
  - sendEmail returns a Promise but the return value is discarded (not awaited, not chained)
  - logEvent runs immediately with the un-awaited Promise still pending — the email may not have been sent yet
  - if sendEmail rejects, the rejection becomes an unhandled promise rejection
  - fix is to await sendEmail (and propagate by making the function async, which it already is)
starter:
  kind: single
  language: typescript
  code: |
    async function notifySignup(user: { email: string }): Promise<void> {
      sendEmail(user.email, 'Welcome!');
      logEvent('signup_email_sent', { email: user.email });
    }

    declare function sendEmail(to: string, subject: string): Promise<void>;
    declare function logEvent(name: string, payload: Record<string, unknown>): void;
---

The function above is meant to send a welcome email and then log that it was sent. There's a subtle but important bug. Identify it, explain what goes wrong at runtime (and what the user-visible consequence might be), and write the corrected function.

Bonus: explain what would happen if `sendEmail` throws — both before and after your fix.
