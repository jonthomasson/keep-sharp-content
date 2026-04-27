/**
 * verify-dist.ts
 *
 * Sanity-checks the built dist/ output the same way the extension would, minus
 * the network: reads manifest.json, then for each pack reads the file, recomputes
 * the sha256, and validates the pack schema. Useful before pushing a release tag.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { challengeFrontmatterSchema } from './schema';

const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');
const MANIFEST = join(DIST, 'manifest.json');

interface ManifestPack {
  id: string;
  url: string;
  sha256: string;
  packVersion: string;
  schemaVersion: number;
  challengeCount: number;
  sizeBytes: number;
}

interface Manifest {
  schemaVersion: number;
  packs: ManifestPack[];
}

if (!existsSync(MANIFEST)) {
  console.error(`No manifest at ${MANIFEST}. Run "npm run build" first.`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf-8')) as Manifest;
if (manifest.schemaVersion !== 1) {
  console.error(`Unsupported manifest schemaVersion ${manifest.schemaVersion}.`);
  process.exit(1);
}

let problems = 0;
const lines: string[] = [];

for (const pack of manifest.packs) {
  const packPath = join(DIST, pack.url);
  if (!existsSync(packPath)) {
    lines.push(`[FAIL] ${pack.id}: file not found at ${pack.url}`);
    problems++;
    continue;
  }
  const bytes = readFileSync(packPath);
  const actualSha = createHash('sha256').update(bytes).digest('hex');
  const actualSize = bytes.byteLength;
  const sizeOk = actualSize === pack.sizeBytes;
  const shaOk = actualSha.toLowerCase() === pack.sha256.toLowerCase();

  let parsed: { challenges: unknown[]; packId: string; packVersion: string; schemaVersion: number };
  try {
    parsed = JSON.parse(bytes.toString('utf-8'));
  } catch (err) {
    lines.push(`[FAIL] ${pack.id}: invalid JSON — ${(err as Error).message}`);
    problems++;
    continue;
  }

  const packIdOk = parsed.packId === pack.id;
  const packVersionOk = parsed.packVersion === pack.packVersion;
  const schemaOk = parsed.schemaVersion === pack.schemaVersion;
  const countOk = parsed.challenges.length === pack.challengeCount;

  // Validate every challenge with the same schema authors use
  let badChallenges = 0;
  for (let i = 0; i < parsed.challenges.length; i++) {
    const c = parsed.challenges[i] as Record<string, unknown>;
    // verify-side schema check: drop the runtime-injected fields the build added
    // so we can run the original frontmatter validator
    const { schemaVersion: _sv, instructions: _ins, packId: _pid, packVersion: _pv, ...frontmatter } = c;
    const result = challengeFrontmatterSchema.safeParse(frontmatter);
    if (!result.success) {
      badChallenges++;
      if (badChallenges <= 3) {
        lines.push(
          `  [FAIL] ${pack.id} challenge[${i}] (${(c.id as string) ?? '?'}): ${result.error.issues
            .map((iss) => `${iss.path.join('.')}—${iss.message}`)
            .join('; ')}`,
        );
      }
    }
  }

  const status =
    sizeOk && shaOk && packIdOk && packVersionOk && schemaOk && countOk && badChallenges === 0
      ? 'OK  '
      : 'FAIL';
  if (status === 'FAIL') problems++;
  const flags = [
    !sizeOk && `size(${actualSize}≠${pack.sizeBytes})`,
    !shaOk && 'sha256-mismatch',
    !packIdOk && `packId(${parsed.packId}≠${pack.id})`,
    !packVersionOk && `packVersion(${parsed.packVersion}≠${pack.packVersion})`,
    !schemaOk && `schemaVersion(${parsed.schemaVersion}≠${pack.schemaVersion})`,
    !countOk && `count(${parsed.challenges.length}≠${pack.challengeCount})`,
    badChallenges > 0 && `${badChallenges} bad challenge(s)`,
  ].filter(Boolean) as string[];
  const detail = flags.length === 0 ? 'sha256 verified' : flags.join(', ');
  lines.push(`[${status}] ${pack.id}@${pack.packVersion} — ${pack.challengeCount} challenges, ${actualSize}B, ${detail}`);
}

console.log(`Verifying ${manifest.packs.length} pack(s) in dist/:`);
console.log(lines.join('\n'));

if (problems > 0) {
  console.error(`\n${problems} pack(s) failed verification.`);
  process.exit(1);
}
console.log('\nAll packs verified. The extension would accept this catalog.');
