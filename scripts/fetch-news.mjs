// Pulls headlines from the feeds listed in src/data/sources.json and writes
// src/data/news.json. Only the headline, a short snippet and a link back to the
// original story are kept. A failing feed is skipped and never breaks the build.
import { readFile, writeFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const MAX_AGE_DAYS = 14;
const MAX_PER_SOURCE = 10;
const MAX_TOTAL = 60;
const SNIPPET_LENGTH = 220;
const TIMEOUT_MS = 20000;

const sources = JSON.parse(await readFile('src/data/sources.json', 'utf8'));
const hidden = new Set(JSON.parse(await readFile('src/data/hidden-news.json', 'utf8')));
const blocked = JSON.parse(await readFile('src/data/blocked-words.json', 'utf8')).map((w) => w.toLowerCase());
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', processEntities: true });

const asArray = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const text = (v) => (v && typeof v === 'object' ? (v['#text'] ?? '') : (v ?? '')).toString();

function clean(html) {
  return text(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function snippet(s) {
  if (s.length <= SNIPPET_LENGTH) return s;
  const cut = s.slice(0, SNIPPET_LENGTH);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:\-\s]+$/, '') + '…';
}

function linkOf(entry) {
  const l = entry.link;
  if (typeof l === 'string') return l.trim();
  const links = asArray(l);
  const alt = links.find((x) => x?.['@_rel'] === 'alternate') ?? links[0];
  return (alt?.['@_href'] ?? text(alt)).trim();
}

async function readFeed(source) {
  const res = await fetch(source.url, {
    headers: { 'User-Agent': 'MissionBayNews/1.0 (editor@missionbaynews.us)', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const doc = parser.parse(await res.text());
  const entries = doc.rss ? asArray(doc.rss.channel?.item) : doc.feed ? asArray(doc.feed.entry) : asArray(doc['rdf:RDF']?.item);
  const cutoff = Date.now() - MAX_AGE_DAYS * 864e5;

  return entries
    .map((e) => {
      const published = new Date(text(e.pubDate ?? e.published ?? e.updated ?? e['dc:date']));
      return {
        title: clean(e.title),
        link: linkOf(e),
        source: source.name,
        category: source.category,
        published: isNaN(published) ? null : published.toISOString(),
        snippet: snippet(clean(e.description ?? e.summary ?? e['content:encoded'] ?? '')),
      };
    })
    .filter((i) => i.title && /^https?:\/\//.test(i.link))
    .filter((i) => !source.onlyHost || new URL(i.link).hostname.replace(/^www\./, '') === source.onlyHost)
    .filter((i) => !blocked.some((w) => `${i.title} ${i.snippet}`.toLowerCase().includes(w)))
    .filter((i) => !i.published || Date.parse(i.published) >= cutoff)
    .sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''))
    .slice(0, MAX_PER_SOURCE);
}

const results = await Promise.allSettled(sources.map(readFeed));
const items = [];
const status = [];

results.forEach((r, i) => {
  const name = sources[i].name;
  if (r.status === 'fulfilled') {
    items.push(...r.value);
    status.push(`  ok    ${name} (${r.value.length})`);
  } else {
    status.push(`  FAIL  ${name}: ${r.reason?.message ?? r.reason}`);
  }
});

const seen = new Set();
const unique = items
  .filter((i) => !hidden.has(i.link))
  .filter((i) => (seen.has(i.link) ? false : seen.add(i.link)))
  .sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''))
  .slice(0, MAX_TOTAL);

await writeFile('src/data/news.json', JSON.stringify({ generatedAt: new Date().toISOString(), items: unique }, null, 2));
console.log(`News feeds:\n${status.join('\n')}\nSaved ${unique.length} headlines.`);
