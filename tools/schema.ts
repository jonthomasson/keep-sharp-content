// Zod schema for challenges authored as Markdown + YAML frontmatter.
// MUST stay in sync with src/models/Challenge.ts in keep-sharp-dev.
//
// Source of truth lives there; this file is a build-time validator only.

import { z } from 'zod';

export const challengeCategoryEnum = z.enum([
  'explain',
  'debug',
  'write',
  'refactor',
  'tests',
  'security',
  'a11y',
  'architecture',
  'design',
]);

export const difficultyEnum = z.enum(['beginner', 'intermediate', 'advanced']);

export const starterFileSchema = z.object({
  path: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
});

export const starterCodeSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('single'),
    language: z.string().min(1),
    code: z.string().min(1),
  }),
  z.object({
    kind: z.literal('multi'),
    files: z.array(starterFileSchema).min(1),
  }),
]);

export const challengeVariantSchema = z.object({
  language: z.string().min(1),
  framework: z.string().optional(),
  starter: starterCodeSchema.optional(),
  expectedConcepts: z.array(z.string().min(1)).optional(),
});

export const ID_REGEX = /^[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/;

export const challengeFrontmatterSchema = z.object({
  id: z.string().regex(ID_REGEX, 'id must match <pack>/<slug>, lowercase + hyphens'),
  title: z.string().min(3).max(120),
  category: challengeCategoryEnum,
  difficulty: difficultyEnum,
  language: z.string().min(1),
  framework: z.string().optional(),
  topics: z.array(z.string()).min(1).max(8),
  tags: z.array(z.string()).max(8).optional(),
  starter: starterCodeSchema.optional(),
  expectedConcepts: z.array(z.string().min(3)).min(1).max(8),
  solutionArchetypes: z.array(z.string().min(3)).max(6).optional(),
  variants: z.array(challengeVariantSchema).optional(),
});

export type ChallengeFrontmatter = z.infer<typeof challengeFrontmatterSchema>;

// The runtime Challenge shape (matches src/models/Challenge.ts in keep-sharp-dev).
export interface ChallengeOut extends ChallengeFrontmatter {
  schemaVersion: 2;
  instructions: string;
  packId: string;
  packVersion: string;
}

export const packMetaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  packVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'packVersion must be semver MAJOR.MINOR.PATCH'),
});

export const packsRegistrySchema = z.record(z.string(), packMetaSchema);
export type PackMeta = z.infer<typeof packMetaSchema>;
export type PacksRegistry = z.infer<typeof packsRegistrySchema>;
