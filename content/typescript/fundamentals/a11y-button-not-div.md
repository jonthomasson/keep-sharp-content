---
id: ts-fundamentals/a11y-button-not-div
title: 'Find the a11y issues: clickable div'
category: a11y
difficulty: beginner
language: typescript
topics: [a11y, dom]
tags: [aria, semantics]
starter:
  kind: single
  language: typescript
  code: |
    interface Props { onConfirm: () => void; label: string }

    export function ConfirmControl({ onConfirm, label }: Props) {
      return (
        <div className="btn" onClick={onConfirm}>
          {label}
        </div>
      );
    }
expectedConcepts:
  - a div is not focusable by default — keyboard users cannot tab to it or activate it with Enter/Space
  - screen readers announce the element as a generic group, not a button, so the user has no idea it is interactive
  - 'fix is to use the semantic <button> element, which provides focusability, role, and keyboard activation for free'
  - 'if a non-button element is required, add role="button", tabIndex=0, and onKeyDown handling for both Enter and Space'
  - 'visible label text alone is fine for sighted users but does not convey the button role to assistive tech'
---

This React/TSX component looks like a button but has accessibility problems. List **at least three** distinct issues a keyboard or screen-reader user would experience, then rewrite the component to fix them.

Briefly explain (1-2 sentences) why using the semantic `<button>` element is preferable to bolting `role="button"` and `tabIndex` onto the `<div>`.
