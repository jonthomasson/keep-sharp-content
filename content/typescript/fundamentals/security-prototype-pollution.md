---
id: ts-fundamentals/security-prototype-pollution
title: 'Identify the security issue: prototype pollution'
category: security
difficulty: advanced
language: typescript
topics: [security, fundamentals]
tags: [prototype-pollution, deep-merge]
expectedConcepts:
  - the recursive merge writes attacker-controlled keys directly onto target without filtering
  - 'an input like { "__proto__": { "isAdmin": true } } pollutes Object.prototype, so every plain object suddenly has isAdmin === true'
  - the same bug also lets attackers write to "constructor" and "prototype"
  - mitigation is to skip dangerous keys ("__proto__", "constructor", "prototype") OR use Object.create(null) as the target OR use structuredClone / a vetted library
starter:
  kind: single
  language: typescript
  code: |
    type AnyObj = Record<string, any>;

    export function deepMerge(target: AnyObj, source: AnyObj): AnyObj {
      for (const key of Object.keys(source)) {
        const value = source[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          target[key] = deepMerge(target[key] ?? {}, value);
        } else {
          target[key] = value;
        }
      }
      return target;
    }

    // Imagine `req.body` comes from untrusted JSON:
    // deepMerge(userSettings, req.body);
---

The `deepMerge` above is used to apply user-supplied settings on top of defaults. With a malicious `req.body`, this function enables a classic JavaScript vulnerability.

1. Name the vulnerability.
2. Show a concrete attack payload (a JSON object) and describe what it does to `Object.prototype` after the call.
3. Rewrite `deepMerge` to be safe. Briefly explain why your fix works.
