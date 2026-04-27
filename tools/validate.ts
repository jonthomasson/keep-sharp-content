/**
 * validate.ts — runs the full builder in dry-run mode (no files written).
 * Used by PR CI to fail-loud on any malformed challenge.
 */

import { build } from './build-catalog';

try {
  const { challenges, manifest } = build({ write: false });
  console.log(
    `OK — ${manifest.packs.length} pack(s), ${challenges.length} challenge(s) validated.`,
  );
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
