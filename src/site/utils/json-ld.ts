import type { Meta } from '$types';

const SITE_URL = 'https://fluentui-svelte.dev';
const SITE_NAME = 'Fluent UI Svelte';

/** Turns a relative path or absolute URL into an absolute URL rooted at the site. */
function absoluteUrl(path?: string): string | undefined {
	if (!path) return undefined;
	if (/^https?:\/\//i.test(path)) return path;
	try {
		return new URL(path, SITE_URL).toString();
	} catch {
		return undefined;
	}
}

/** Removes keys whose values are `undefined`, `null`, or empty arrays. */
function compact<T extends Record<string, unknown>>(obj: T): T {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value) && value.length === 0) continue;
		out[key] = value;
	}
	return out as T;
}

/**
 * Builds a valid schema.org JSON-LD document from a documentation page `Meta`.
 *
 * Emits an `@graph` containing:
 *   - a `TechArticle` describing the component page (uses SEO + GEO fields), and
 *   - a `FAQPage` when `geo.faq` has entries.
 *
 * If `meta.geo.jsonLd` is provided, it is returned verbatim (wrapped in
 * `@context` + `@graph` when it is an array) — an escape hatch for pages that
 * need fully custom structured data.
 */
export function toJsonLd(meta: Meta): Record<string, unknown> {
	const geo = meta.geo;

	if (geo?.jsonLd) {
		if (Array.isArray(geo.jsonLd)) {
			return { '@context': 'https://schema.org', '@graph': geo.jsonLd };
		}
		return geo.jsonLd as Record<string, unknown>;
	}

	const url = absoluteUrl(meta.canonical) ?? absoluteUrl(meta.openGraph?.url);
	const image = absoluteUrl(meta.openGraph?.image ?? meta.twitter?.image);
	const language = meta.locale?.replace('_', '-') ?? 'en';

	const article = compact({
		'@type': 'TechArticle',
		'@id': url ? `${url}#article` : undefined,
		headline: meta.title,
		name: meta.title,
		description: meta.description,
		keywords: meta.keywords,
		inLanguage: language,
		url,
		mainEntityOfPage: url,
		image,
		abstract: geo?.summary,
		about: geo?.topics?.map((name) => ({ '@type': 'Thing', name })),
		mentions: geo?.entities?.map((name) => ({ '@type': 'Thing', name })),
		articleSection: geo?.category,
		datePublished: geo?.datePublished,
		dateModified: geo?.dateModified,
		author: geo?.author && compact({ '@type': 'Person', name: geo.author.name, url: geo.author.url }),
		isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL }
	});

	const graph: Record<string, unknown>[] = [article];

	if (geo?.faq && geo.faq.length > 0) {
		graph.push(
			compact({
				'@type': 'FAQPage',
				'@id': url ? `${url}#faq` : undefined,
				mainEntity: geo.faq.map((entry) => ({
					'@type': 'Question',
					name: entry.question,
					acceptedAnswer: { '@type': 'Answer', text: entry.answer }
				}))
			})
		);
	}

	return { '@context': 'https://schema.org', '@graph': graph };
}
