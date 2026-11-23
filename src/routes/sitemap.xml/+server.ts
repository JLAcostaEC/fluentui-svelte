import { locales } from '#i18n/runtime.js';
import { docsNavigation } from '#site/utils/docs-navigation.js';
import { sitePageUrl } from '#site/utils/seo-url.js';

export const prerender = true;

export function GET() {
	const paths = ['/', '/about', ...docsNavigation.map(({ url }) => url)];
	const urls = paths.flatMap((path) => locales.map((locale) => `<url><loc>${sitePageUrl(path, locale)}</loc></url>`));
	return new Response(
		[
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			...urls,
			'</urlset>'
		].join('\n'),
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
	);
}
