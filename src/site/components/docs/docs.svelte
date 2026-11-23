<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { Button, ScrollBar } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { deLocalizeUrl } from '#i18n/runtime.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	import { docsNavigation } from '#site/utils/docs-navigation.js';
	import Toc from '#site/components/toc/toc.svelte';
	import DocsSidebar from './docs-sidebar.svelte';
	import DocsSupport from './docs-support.svelte';
	import DocsActions from './docs-actions.svelte';

	let { children }: { children: Snippet } = $props();
	let content = $state<HTMLDivElement | null>(null);
	let sidebar = $state<HTMLElement | null>(null);
	let outline = $state<HTMLElement | null>(null);
	const showSidebar = new MediaQuery('(min-width: 901px)');
	const showOutline = new MediaQuery('(min-width: 1091px)');

	const path = $derived(deLocalizeUrl(page.url).pathname.replace(/\/$/, ''));
	const componentSlug = $derived(path.match(/^\/docs\/components\/([^/]+)$/)?.[1]);
	const position = $derived(docsNavigation.findIndex((entry) => entry.url === path));
	const previous = $derived(position > 0 ? docsNavigation[position - 1] : null);
	const next = $derived(position >= 0 ? docsNavigation[position + 1] : null);
</script>

<div class="site-shell docs-shell">
	<aside class="docs-sidebar" bind:this={sidebar}>
		<DocsSidebar {path} />
	</aside>
	<ScrollBar scrollRef={showSidebar.current ? sidebar : null} size="thin" defer />

	<div class="docs-panel">
		<article id="docs" tabindex="-1">
			{#if !componentSlug}<DocsActions />{/if}

			{#key path}
				<div class="docs-content" bind:this={content}>{@render children()}</div>
			{/key}

			{#if previous || next}
				<nav class="page-navigation" aria-label={m.site_docs_navigation()}>
					{#if previous}
						<Button as="a" appearance="standard" href={localizedPath(previous.url)}>
							<span class="page-link"><small>{m.site_previous()}</small>{previous.label()}</span>
						</Button>
					{/if}
					{#if next}
						<Button as="a" appearance="standard" href={localizedPath(next.url)} class="next-page">
							<span class="page-link"><small>{m.site_next()}</small>{next.label()}</span>
						</Button>
					{/if}
				</nav>
			{/if}

			<DocsSupport />
		</article>

		<aside class="docs-outline" bind:this={outline}>
			<Toc target={content} searchFor="h2, h3, h4" />
		</aside>
		<ScrollBar scrollRef={showOutline.current ? outline : null} size="thin" defer />
	</div>
</div>

<style>
	.docs-shell {
		--fs-site-header-offset: calc(var(--site-header-height, 56px) + 0.5rem);
		display: grid;
		width: 100%;
		grid-template-columns: minmax(13rem, 17vw) minmax(0, 1fr);
		align-items: start;
		padding: 0;
	}
	.docs-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(9rem, 14rem);
		justify-content: center;
		align-items: start;
		gap: clamp(1.5rem, 3vw, 3rem);
		min-width: 0;
		min-height: calc(100dvh - var(--fs-site-header-offset));
		margin-block-start: 0.5rem;
		padding: 2.5rem clamp(1rem, 3vw, 3rem) 4rem;
		border: 1px solid var(--fs-card-stroke-default);
		border-inline-end: 0;
		border-start-start-radius: 0.5rem;
		background: var(--fs-solid-background-tertiary);
	}

	.docs-sidebar,
	.docs-outline {
		position: sticky;
		top: var(--fs-site-header-offset);
		max-height: max(8rem, calc(100dvh - var(--fs-site-header-offset) - var(--site-footer-height, 0px)));
		overflow: auto;
		min-width: 0;
		scrollbar-width: thin;
	}
	.docs-sidebar {
		padding: 0.25rem 0.5rem 1rem;
		& :global(.fs-side-nav) {
			max-width: 100%;
		}
	}
	.docs-outline {
		width: 100%;
		justify-self: end;
		padding-inline-start: clamp(0.75rem, 2.2vw, 2.25rem);
	}
	.docs-outline :global(.toc h3) {
		font-size: 0.85rem;
		font-weight: 650;
	}
	#docs {
		width: min(100%, 50rem);
		min-width: 0;
		justify-self: center;
		outline: none;
		overflow-wrap: anywhere;
		scroll-margin-block-start: var(--fs-site-header-offset);
	}
	.docs-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.95rem;
		min-width: 0;
		& > :global(*) {
			max-width: 100%;
		}
		& > :global(h1) {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 0.6rem;
			margin-block: 0.25rem;
			font-size: 2rem;
			line-height: 1.18;
			letter-spacing: -0.025em;
			font-weight: 650;
			overflow-wrap: anywhere;
		}
		& > :global(h2) {
			font-size: 1.55rem;
			font-weight: 650;
			margin-block-start: 1.1rem;
		}
		& > :global(h3) {
			font-size: var(--fs-title3-font-size);
			font-weight: 650;
		}
		& > :global(:is(h1, h2, h3, h4, h5, h6)[id]) {
			scroll-margin-block-start: 8rem;
		}
		& > :global(.shiki) {
			width: 100%;
			overflow: auto;
		}
		& :global(table.fs-docs) {
			width: 100%;
			max-width: 100%;
			overflow-wrap: anywhere;
		}
		& :global(.table-preview) {
			width: 100%;
			overflow-x: auto;
		}
	}
	.page-navigation {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		margin-block-start: 1.5rem;
		& :global(.fs-button) {
			min-width: 0;
			justify-content: flex-start;
			white-space: normal;
		}
		& :global(.next-page) {
			grid-column: 2;
			justify-content: flex-end;
			& .page-link {
				text-align: end;
			}
		}
	}
	.page-link {
		display: grid;
		gap: 0.3rem;
		text-align: start;
		overflow-wrap: anywhere;
		& small {
			color: var(--fs-text-secondary);
		}
	}

	@media (max-width: 1090px) {
		.docs-panel {
			grid-template-columns: minmax(0, 49rem);
		}
		.docs-outline {
			display: none;
		}
	}
	@media (max-width: 900px) {
		.docs-shell {
			grid-template-columns: minmax(0, 1fr);
		}
		.docs-sidebar {
			display: none;
		}
		.docs-panel {
			padding: 1.4rem 1rem 3rem;
			border-inline-start: 0;
			border-radius: 0;
		}
		.docs-content :global(table.fs-docs) {
			table-layout: fixed;
		}
		.docs-content :global(.props-table :is(th, td):nth-child(3)) {
			display: none;
		}
	}
	@media (max-width: 600px) {
		.docs-content :global(.props-table :is(th, td):nth-child(4)) {
			display: none;
		}
	}
</style>
