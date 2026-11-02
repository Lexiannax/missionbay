import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = [
  'Park Notices',
  'Community',
  'Events & Clubs',
  'Neighbor Spotlight',
  'Rent & Rights',
  'Health & Safety',
  'Local Government',
] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    category: z.enum(CATEGORIES).default('Community'),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
  }),
});

const newsletters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletters' }),
  schema: z.object({
    title: z.string(),
    issueDate: z.coerce.date(),
    pdf: z.string(),
    summary: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { articles, events, newsletters, pages };
