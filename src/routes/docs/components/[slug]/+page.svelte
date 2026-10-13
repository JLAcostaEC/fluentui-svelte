<script lang="ts">
	import type { ConfigDocs } from '$types';
	import Seo from '$site/components/seo/seo.svelte';

	let { data }: { data: ConfigDocs } = $props();

	const Docs = $derived(data.docs);
	const Footer = $derived(data.footer);
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
