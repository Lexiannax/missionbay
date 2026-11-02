import { readFileSync } from 'node:fs';
import { getCollection } from 'astro:content';

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  category: string;
  published: string | null;
  snippet: string;
}

export interface NewsFeed {
  generatedAt: string | null;
  items: NewsItem[];
}

/** Headlines saved by scripts/fetch-news.mjs. Missing file means no headlines yet. */
export function loadNews(): NewsFeed {
  try {
    return JSON.parse(readFileSync('src/data/news.json', 'utf8'));
  } catch {
    return { generatedAt: null, items: [] };
  }
}

/** Published articles, newest first, with pinned articles ahead of the rest. */
export async function getArticles() {
  const all = await getCollection('articles', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getNewsletters() {
  const all = await getCollection('newsletters');
  return all.sort((a, b) => b.data.issueDate.valueOf() - a.data.issueDate.valueOf());
}

// Dates typed in the editor are plain calendar days, so they are shown as written.
export const formatDay = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const formatMonth = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });

export const formatPublished = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles' })
    : '';
