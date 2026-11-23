import { SITE_URL } from '#site/constants.js';

export const prerender = true;

export function GET() {
	return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
