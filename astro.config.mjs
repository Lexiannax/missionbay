import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://missionbaynews.us',
  output: 'static',
  trailingSlash: 'always',
  redirects: { '/register/': '/join/' },
  integrations: [sitemap({ filter: (page) => !page.includes('/admin/') && !page.includes('/search/') })],
});
