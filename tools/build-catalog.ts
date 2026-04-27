/**
 * build-catalog.ts
 *
 * Walks content/**\/*.md, parses YAML frontmatter, validates each challenge against
 * the schema, groups by packId (slash-prefix of `id`), and emits:
 *   dist/manifest.json                 — pack list with pre-computed facets
 *   dist/packs/<id>@<v>.json           — one file per pack
 *
 * Fails non-zero on any validation error so PR CI catches bad content.
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';
import {
  ID_REGEX,
  challengeFrontmatterSchema,
  packsRegistrySchema,
  type ChallengeFrontmatter,
  type ChallengeOut,
  type PacksRegistry,
} from './schema';

const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');
const DIST_DIR = join(ROOT, 'dist');
const PACKS_OUT_DIR = join(DIST_DIR, 'packs');
const TOOLS_DIR = join(ROOT, 'tools');

// ---- main -----------------------------------------------------------------

export interface BuildResult {
  challenges: ChallengeOut[];
  manifest: ManifestOut;
}

export interface ManifestOut {
  schemaVersion: 1;
  generatedAt: string;
  catalogVersion: string;
  challengeSchemaVersions: number[];
  packs: PackRefOut[];
}

export interface PackRefOut {
  id: string;
  title: string;
  description: string;
  url: string;
  sizeBytes: number;
  sha256: string;
  challengeCount: number;
  schemaVersion: number;
  packVersion: string;
  languages: string[];
  frameworks?: string[];
  topics: string[];
  difficulties: string[];
  categories: string[];
}

export function build({ write }: { write: boolean }): BuildResult {
  const topics = readAllowList('topics.txt');
  const languages = readAllowList('languages.txt');
  const frameworks = readAllowList('frameworks.txt');
  const packsRegistry = readPacksRegistry();

  const files = walk(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    throw fail('No challenge files found under content/.');
  }

  const seenIds = new Set<string>();
  const errors: string[] = [];
  const byPack = new Map<string, ChallengeOut[]>();

  for (const file of files) {
    const rel = relative(ROOT, file);
    let parsed: { data: unknown; content: string };
    try {
      parsed = matter(readFileSync(file, 'utf-8'));
    } catch (err) {
      errors.push(`${rel}: failed to parse frontmatter — ${(err as Error).message}`);
      continue;
    }

    const fmResult = challengeFrontmatterSchema.safeParse(parsed.data);
    if (!fmResult.success) {
      for (const issue of fmResult.error.issues) {
        errors.push(`${rel}: ${issue.path.join('.')} — ${issue.message}`);
      }
      continue;
    }
    const fm = fmResult.data;

    if (seenIds.has(fm.id)) {
      errors.push(`${rel}: duplicate id "${fm.id}"`);
      continue;
    }
    seenIds.add(fm.id);

    const instructions = parsed.content.trim();
    if (instructions.length === 0) {
      errors.push(`${rel}: instructions body is empty`);
      continue;
    }

    if (!topics.has('*')) {
      const badTopics = fm.topics.filter((t) => !topics.has(t));
      if (badTopics.length > 0) {
        errors.push(`${rel}: unknown topics ${JSON.stringify(badTopics)} — extend tools/topics.txt to allow them`);
      }
    }
    if (fm.language !== '*' && !languages.has(fm.language)) {
      errors.push(`${rel}: unknown language "${fm.language}" — extend tools/languages.txt to allow it`);
    }
    if (fm.framework && !frameworks.has(fm.framework)) {
      errors.push(`${rel}: unknown framework "${fm.framework}" — extend tools/frameworks.txt to allow it`);
    }
    if (fm.language === '*' && (!fm.variants || fm.variants.length === 0)) {
      errors.push(`${rel}: language is "*" but no variants are provided`);
    }
    for (const v of fm.variants ?? []) {
      if (v.language !== '*' && !languages.has(v.language)) {
        errors.push(`${rel}: variant language "${v.language}" not in tools/languages.txt`);
      }
      if (v.framework && !frameworks.has(v.framework)) {
        errors.push(`${rel}: variant framework "${v.framework}" not in tools/frameworks.txt`);
      }
    }

    const packId = packIdFromChallengeId(fm.id);
    if (!packId) {
      errors.push(`${rel}: cannot derive packId from id "${fm.id}"`);
      continue;
    }
    const packMeta = packsRegistry[packId];
    if (!packMeta) {
      errors.push(`${rel}: pack "${packId}" not registered in tools/packs.json`);
      continue;
    }

    const challengeOut: ChallengeOut = withSchemaTags(fm, instructions, packId, packMeta.packVersion);
    const list = byPack.get(packId) ?? [];
    list.push(challengeOut);
    byPack.set(packId, list);
  }

  if (errors.length > 0) {
    throw fail(`Catalog validation failed with ${errors.length} error(s):\n  - ${errors.join('\n  - ')}`);
  }

  // Build manifest + per-pack files
  const packs: PackRefOut[] = [];
  const allChallenges: ChallengeOut[] = [];

  for (const [packId, packMeta] of Object.entries(packsRegistry)) {
    const challenges = byPack.get(packId);
    if (!challenges || challenges.length === 0) {
      // Empty registered packs are skipped silently (might be a placeholder for upcoming content).
      continue;
    }
    challenges.sort((a, b) => a.id.localeCompare(b.id));

    const packFile = {
      schemaVersion: 2 as const,
      packId,
      packVersion: packMeta.packVersion,
      challenges,
    };
    const body = JSON.stringify(packFile, null, 2) + '\n';
    const bytes = Buffer.from(body, 'utf-8');
    const sha = createHash('sha256').update(bytes).digest('hex');
    const fileName = `${packId}@${packMeta.packVersion}.json`;

    if (write) {
      mkdirSync(PACKS_OUT_DIR, { recursive: true });
      writeFileSync(join(PACKS_OUT_DIR, fileName), bytes);
    }

    packs.push({
      id: packId,
      title: packMeta.title,
      description: packMeta.description,
      url: `packs/${fileName}`,
      sizeBytes: bytes.byteLength,
      sha256: sha,
      challengeCount: challenges.length,
      schemaVersion: 2,
      packVersion: packMeta.packVersion,
      languages: distinctSorted(challenges.map((c) => c.language)),
      frameworks: optionalDistinctSorted(challenges.map((c) => c.framework)),
      topics: distinctSorted(challenges.flatMap((c) => c.topics)),
      difficulties: distinctSorted(challenges.map((c) => c.difficulty)),
      categories: distinctSorted(challenges.map((c) => c.category)),
    });

    allChallenges.push(...challenges);
  }

  // Warn (don't fail) when a registered pack produced zero challenges.
  for (const packId of Object.keys(packsRegistry)) {
    if (!byPack.has(packId)) {
      console.warn(`warning: registered pack "${packId}" has no challenges yet.`);
    }
  }

  const manifest: ManifestOut = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    catalogVersion: deriveCatalogVersion(),
    challengeSchemaVersions: [2],
    packs: packs.sort((a, b) => a.id.localeCompare(b.id)),
  };

  if (write) {
    if (existsSync(DIST_DIR)) {
      // keep packs we just wrote; clean stale top-level files
      const top = readdirSync(DIST_DIR);
      for (const entry of top) {
        if (entry === 'packs') continue;
        rmSync(join(DIST_DIR, entry), { recursive: true, force: true });
      }
    } else {
      mkdirSync(DIST_DIR, { recursive: true });
    }
    writeFileSync(join(DIST_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  }

  return { challenges: allChallenges, manifest };
}

// ---- helpers --------------------------------------------------------------

function withSchemaTags(
  fm: ChallengeFrontmatter,
  instructions: string,
  packId: string,
  packVersion: string,
): ChallengeOut {
  return {
    ...fm,
    schemaVersion: 2,
    instructions,
    packId,
    packVersion,
  };
}

function packIdFromChallengeId(id: string): string | undefined {
  const match = ID_REGEX.exec(id);
  if (!match) return undefined;
  const slash = id.indexOf('/');
  return slash > 0 ? id.slice(0, slash) : undefined;
}

function readAllowList(name: string): Set<string> {
  const path = join(TOOLS_DIR, name);
  const text = readFileSync(path, 'utf-8');
  return new Set(text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')));
}

function readPacksRegistry(): PacksRegistry {
  const text = readFileSync(join(TOOLS_DIR, 'packs.json'), 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw fail(`tools/packs.json is not valid JSON: ${(err as Error).message}`);
  }
  const result = packsRegistrySchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    throw fail(`tools/packs.json invalid:\n  - ${issues.join('\n  - ')}`);
  }
  return result.data;
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function distinctSorted<T>(arr: T[]): T[] {
  return [...new Set(arr.filter((v): v is T => v !== undefined))].sort();
}

function optionalDistinctSorted(arr: Array<string | undefined>): string[] | undefined {
  const cleaned = arr.filter((v): v is string => typeof v === 'string');
  if (cleaned.length === 0) return undefined;
  return [...new Set(cleaned)].sort();
}

function deriveCatalogVersion(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}.${(d.getUTCMonth() + 1).toString().padStart(2, '0')}.${d.getUTCDate().toString().padStart(2, '0')}`;
}

function fail(message: string): Error {
  const e = new Error(message);
  e.name = 'BuildError';
  return e;
}

// ---- CLI entry ------------------------------------------------------------

if (require.main === module) {
  try {
    const result = build({ write: true });
    const lines = [
      `Built ${result.manifest.packs.length} pack(s) (${result.challenges.length} challenges total):`,
      ...result.manifest.packs.map((p) => `  - ${p.id}@${p.packVersion} — ${p.challengeCount} challenges (${(p.sizeBytes / 1024).toFixed(1)}KB)`),
      `Wrote dist${sep}manifest.json + dist${sep}packs/`,
    ];
    console.log(lines.join('\n'));
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}
