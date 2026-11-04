import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL — update when the custom domain (e.g. casaplaya204.com) is connected.
export const SITE_URL = process.env.URL && !process.env.URL.includes('localhost')
  ? process.env.URL
  : 'https://aruba-itf5.netlify.app';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  // hreflang alternates are emitted in each page's <head>; the sitemap lists every URL in every language.
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
