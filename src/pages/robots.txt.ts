import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://example.invalid');
  const sitemapUrl = new URL('/sitemap.xml', siteUrl);
  const body = ['User-agent: *', 'Allow: /', `Sitemap: ${sitemapUrl}`, ''].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
