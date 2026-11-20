<script lang="ts">
	import type { ConfigDocs } from '#types';
	import Seo from '#site/components/seo/seo.svelte';
	import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, Tag } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { componentExports } from '#site/utils/component-exports.js';
	import { localizedPath } from '#site/utils/localized-path.js';

	let { data }: { data: ConfigDocs } = $props();

	const Docs = $derived(data.docs);
	const Footer = $derived(data.footer);
	const exports = $derived(componentExports(data.meta.slug));
</script>

<Seo
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	robots={data.meta.robots}
	openGraph={{ type: 'article', ...data.meta.openGraph }}
	twitter={data.meta.twitter}
/>

<svelte:head>
	<!-- The same page as Markdown, for AI agents. -->
	<link rel="alternate" type="text/markdown" href="/docs/components/{data.meta.slug}.md" />
</svelte:head>

<Breadcrumb aria-label={m.site_docs_navigation()}>
	<BreadcrumbItem
		><BreadcrumbButton as="a" href={localizedPath('/docs')}>{m.global_docs()}</BreadcrumbButton></BreadcrumbItem
	>
	<BreadcrumbDivider />
	<BreadcrumbItem
		><BreadcrumbButton as="a" href={localizedPath('/docs/components')}>{m.docs_nav_title()}</BreadcrumbButton
		></BreadcrumbItem
	>
	<BreadcrumbDivider />
	<BreadcrumbItem><BreadcrumbButton current>{data.meta.title}</BreadcrumbButton></BreadcrumbItem>
</Breadcrumb>

{#if exports.length}
	<div class="component-exports">
		<p id="component-exports-label">{m.site_docs_exports()}</p>
		<ul aria-labelledby="component-exports-label">
			{#each exports as name (name)}
				<li><Tag shape="rounded" size="small">{name}</Tag></li>
			{/each}
		</ul>
	</div>
{/if}

<Docs />

{#each data.examples as Example, index (index)}
	<Example />
{/each}

<Footer />

<style>
	.component-exports {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.35rem 0.65rem;

		& p {
			color: var(--fs-text-secondary);
			font-size: var(--fs-caption-font-size);
		}
		& ul {
			display: flex;
			flex-wrap: wrap;
			gap: 0.35rem;
			padding: 0;
			list-style: none;
		}
	}
	:global(#docs table.fs-docs tbody tr td) {
		font-size: var(--fs-caption-font-size);
	}
</style>
