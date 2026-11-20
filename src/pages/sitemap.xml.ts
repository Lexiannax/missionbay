// Many people (and older Search Console entries) look for /sitemap.xml. The sitemap integration builds sitemap-index.xml,
// so this serves the same index under the common name. It points at the real page list, sitemap-0.xml.
export function GET() {
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    '<sitemap><loc>https://missionbaynews.us/sitemap-0.xml</loc></sitemap>' +
    '</sitemapindex>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
