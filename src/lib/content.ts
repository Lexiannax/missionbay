import { readFileSync } from 'node:fs';
import { getCollection } from 'astro:content';
import { dayKey, parseTime, todayKey } from './calendar';

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

export interface Weather {
  generatedAt: string | null;
  periods: { name: string; temperature: number; unit: string; summary: string }[];
}

/** Forecast saved by scripts/fetch-weather.mjs. Missing file means no weather yet. */
export function loadWeather(): Weather {
  try {
    return JSON.parse(readFileSync('src/data/weather.json', 'utf8'));
  } catch {
    return { generatedAt: null, periods: [] };
  }
}

/** Events happening today or later, soonest first. The site rebuilds every 3 hours, so past events drop off on their own. */
export async function getUpcomingEvents() {
  const today = todayKey();
  const all = await getCollection('events');
  return all
    .filter((e) => dayKey(e.data.date) >= today)
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf() || (parseTime(a.data.startTime)?.h ?? 0) - (parseTime(b.data.startTime)?.h ?? 0));
}

export const formatEventDay = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const formatEventShort = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
