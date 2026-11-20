import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const hold = JSON.parse(readFileSync(new URL('./src/data/review-hold.json', import.meta.url), 'utf8'));
const leftOut = ['/admin/', '/search/', ...(hold.hold ? hold.paths : [])];

export default defineConfig({
  site: 'https://missionbaynews.us',
  output: 'static',
  trailingSlash: 'always',
  redirects: { '/register/': '/join/' },
  integrations: [sitemap({ filter: (page) => !leftOut.some((p) => page.includes(p)) })],
});
