<script lang="ts">
	import { page } from '$app/state';
	import { blur } from 'svelte/transition';
	import { useIntersectionObserver } from 'runed';
	import { ListView, ListViewItem } from '$lib/index.js';
	import { getLinks, type TocLink, type TocProps } from './toc.ts';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';

	const globalContext = getGlobalFSContext();

	const { state: globalState } = globalContext!;

	let { selector, searchFor = 'h1, h2, h3, h4, h5, h6', offset = '80px' }: TocProps = $props();

	let links: TocLink[] = $state([]);
	let headings: HTMLElement[] = $state([]);
	let key = $state('');
	let activeId = $state('');

	$effect(() => {
		if (page.url.pathname !== key) {
			key = page.url.pathname;

			setTimeout(() => {
				const wrapper = document.querySelector(selector);

				if (!wrapper) {
					console.warn(`No element found for selector: ${selector}`);
					return () => {};
				}

				const current = getLinks(wrapper, searchFor, offset);

				links = current.result;
				headings = current.headings;
			}, 600);
		}
	});

	useIntersectionObserver(
		() => headings,
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activeId = entry.target.getAttribute('id') || '';
				}
			});
		},
		{
			root: () => null,
			rootMargin: '0px 0px -85% 0px'
		}
	);
</script>

<div class="toc">
	<h3>On this page:</h3>
	{#key key}
		<div
			in:blur={!globalState.reducedMotion ? { amount: 20, delay: 500 } : { duration: 0 }}
			out:blur={!globalState.reducedMotion ? { amount: 20 } : { duration: 0 }}
		>
			<ListView role="menu">
				{@render ToC(links)}
			</ListView>
		</div>
	{/key}
</div>

{#snippet ToC(items: TocLink[])}
	{#each items as { id, text, children } (id)}
		<li role="none">
			<ListViewItem as="a" href={`#${id}`} role="menuitem" active={activeId === id} shape="rounded">
				{text}
			</ListViewItem>
			{#if children && children.length > 0}
				<ListView>
					{@render ToC(children)}
				</ListView>
			{/if}
		</li>
	{/each}
{/snippet}

<style>
	.toc {
		position: sticky;
		top: 80px;
		& h3 {
			margin-bottom: 1rem;
		}
		& :global(.fs-list-view .fs-list-view) {
			list-style: none;
			margin: 0;
			padding-left: 1rem !important;
		}
	}
</style>
