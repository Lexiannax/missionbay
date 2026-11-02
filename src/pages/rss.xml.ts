import type { APIContext } from 'astro';
import { getArticles } from '../lib/content';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(context: APIContext) {
  const site = context.site!.href.replace(/\/$/, '');
  const articles = (await getArticles()).slice(0, 30);

  const items = articles
    .map(
      (a) => `    <item>
      <title>${escape(a.data.title)}</title>
      <link>${site}/articles/${a.id}/</link>
      <guid>${site}/articles/${a.id}/</guid>
      <pubDate>${a.data.date.toUTCString()}</pubDate>
      <description>${escape(a.data.summary)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mission Bay Community News</title>
    <link>${site}/</link>
    <description>News for the residents of Mission Bay, San Leandro, California.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
