<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import { page } from '$app/state';
	import { baseLocale, deLocalizeUrl, extractLocaleFromUrl, locales } from '#i18n/runtime.js';
	import { SITE_NAME, SITE_URL } from '#site/constants.js';
	import { sitePageUrl } from '#site/utils/seo-url.js';
	import type { SeoMeta } from '#types';

	type Props = Pick<SeoMeta, 'title' | 'description'> &
		Partial<Omit<SeoMeta, 'title' | 'description' | 'locale'>> & {
			/** `%s` is replaced with `title`. */
			titleTemplate?: string;
		};

	const OG_LOCALES: Record<string, string> = { en: 'en_US', es: 'es_ES' };
	const DEFAULT_IMAGE = '/images/banner.png';

	let {
		title,
		description,
		keywords,
		canonical,
		robots = 'index, follow',
		openGraph,
		twitter,
		titleTemplate = `%s | ${SITE_NAME}`
	}: Props = $props();

	const locale = $derived(extractLocaleFromUrl(page.url.href) ?? baseLocale);
	const isAbsolute = $derived(!!canonical && /^https?:\/\//.test(canonical));
	const path = $derived(canonical && !isAbsolute ? canonical : deLocalizeUrl(page.url).pathname);

	const hrefFor = (target: (typeof locales)[number]) => sitePageUrl(path, target);

	const canonicalUrl = $derived(isAbsolute ? canonical : hrefFor(locale));
	const languageAlternates = $derived(
		isAbsolute
			? []
			: [
					...locales.map((hrefLang) => ({ hrefLang, href: hrefFor(hrefLang) })),
					{ hrefLang: 'x-default', href: hrefFor(baseLocale) }
				]
	);

	const image = $derived(new URL(openGraph?.image ?? twitter?.image ?? DEFAULT_IMAGE, SITE_URL).href);
</script>

<MetaTags
	{title}
	{titleTemplate}
	{description}
	{keywords}
	{robots}
	canonical={canonicalUrl}
	{languageAlternates}
	openGraph={{
		title: openGraph?.title ?? title,
		description: openGraph?.description ?? description,
		type: openGraph?.type ?? 'website',
		url: canonicalUrl,
		siteName: openGraph?.siteName ?? SITE_NAME,
		locale: OG_LOCALES[locale] ?? locale,
		images: [{ url: image, alt: openGraph?.imageAlt ?? title }]
	}}
	twitter={{
		cardType: twitter?.card ?? 'summary_large_image',
		title: twitter?.title ?? openGraph?.title ?? title,
		description: twitter?.description ?? openGraph?.description ?? description,
		image,
		imageAlt: twitter?.imageAlt ?? openGraph?.imageAlt ?? title,
		site: twitter?.site,
		creator: twitter?.creator
	}}
/>
