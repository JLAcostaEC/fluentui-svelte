<script lang="ts">
	import type { ConfigDocs } from '$types';
	import { toJsonLd } from '$site/utils/json-ld.js';
	import { getLocale } from '../../../../i18n/runtime.js';
	import { page } from '$app/state';

	let { data }: { data: ConfigDocs } = $props();

	let locale = $derived(page.url.pathname && getLocale());
	const meta = $derived.by(() => {
		const _locale = locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale;
		return {
			...data.meta,
			locale: _locale
		};
	});
	const stringifiedGEO = $derived(JSON.stringify(toJsonLd(meta)));

	const Docs = $derived(data.docs);
	const Footer = $derived(data.footer);
</script>

<svelte:head>
	<title>{meta.title} — Fluent UI Svelte</title>
	<meta name="description" content={meta.description} />
	<meta name="keywords" content={meta.keywords.join(', ')} />
	{#if meta.robots}<meta name="robots" content={meta.robots} />{/if}
	{#if meta.canonical}<link rel="canonical" href={meta.canonical} />{/if}

	<!-- Open Graph -->
	<meta property="og:title" content={meta.openGraph?.title ?? meta.title} />
	<meta property="og:description" content={meta.openGraph?.description ?? meta.description} />
	<meta property="og:type" content={meta.openGraph?.type ?? 'article'} />
	{#if meta.openGraph?.url}<meta property="og:url" content={meta.openGraph.url} />{/if}
	{#if meta.openGraph?.image}<meta property="og:image" content={meta.openGraph.image} />{/if}
	{#if meta.openGraph?.siteName}<meta property="og:site_name" content={meta.openGraph.siteName} />{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content={meta.twitter?.card ?? 'summary_large_image'} />
	<meta name="twitter:title" content={meta.twitter?.title ?? meta.title} />
	<meta name="twitter:description" content={meta.twitter?.description ?? meta.description} />
	{#if meta.twitter?.image}<meta name="twitter:image" content={meta.twitter.image} />{/if}

	{#if meta.geo}
		<!-- eslint-disable-next-line svelte/no-at-html-tags eslint-disable-next-line no-useless-escape -->
		{@html `<script type="application/ld+json">${stringifiedGEO}<\/script>`}
	{/if}
</svelte:head>

<Docs />

{#each data.examples as Example, index (index)}
	<Example />
{/each}

<Footer />

<style>
	:global(#docs table.fs-docs tbody tr td) {
		font-size: var(--fs-caption-font-size);
	}
	:global(#docs table.fs-docs tbody tr td:nth-child(2)) {
		min-width: 160px;
		max-width: 220px;
	}
</style>
