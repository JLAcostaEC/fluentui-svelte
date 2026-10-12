<script lang="ts">
	import { page } from '$app/state';
	import { blur } from 'svelte/transition';
	import { useIntersectionObserver } from 'runed';
	import { ListView, ListViewItem } from '$lib/index.js';
	import { getLinks, type TocLink, type TocProps } from './toc.ts';
	import { m } from '$i18n/messages.js';
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

<nav class="toc" aria-label={m.docs_toc_title()}>
	<h3>{m.docs_toc_title()}</h3>
	{#key key}
		<div
			in:blur={!globalState.reducedMotion ? { amount: 20, delay: 500 } : { duration: 0 }}
			out:blur={!globalState.reducedMotion ? { amount: 20 } : { duration: 0 }}
		>
			<ListView navigationMode="items">
				{@render ToC(links)}
			</ListView>
		</div>
	{/key}
</nav>

{#snippet ToC(items: TocLink[])}
	{#each items as { id, text, children } (id)}
		{#if children && children.length > 0}
			<ListViewItem class="toc-parent" shape="rounded">
				<a
					class={['toc-parent-link', { active: activeId === id }]}
					href={`#${id}`}
					aria-current={activeId === id ? 'location' : undefined}
				>
					{text}
				</a>
				<ListView navigationMode="items">
					{@render ToC(children)}
				</ListView>
			</ListViewItem>
		{:else}
			<ListViewItem
				as="a"
				href={`#${id}`}
				active={activeId === id}
				aria-current={activeId === id ? 'location' : undefined}
				shape="rounded"
			>
				{text}
			</ListViewItem>
		{/if}
	{/each}
{/snippet}

<style>
	.toc {
		position: sticky;
		top: 80px;
		& h3 {
			margin-bottom: 1rem;
		}
		& :global(.toc-parent) {
			padding: 0;
		}
	}
	.toc-parent-link {
		display: block;
		position: relative;
		padding: 0.275rem 0.713rem 0.4rem;
		border-radius: var(--fs-control-border-radius);
		color: inherit;
		text-decoration: none;
		outline: none;
		&:hover {
			background: var(--fs-subtle-fill-secondary);
		}
		&:active {
			color: var(--fs-text-tertiary);
			background: var(--fs-subtle-fill-tertiary);
		}
		&:focus-visible {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.063rem;
		}
		&.active {
			background: var(--fs-subtle-fill-tertiary);
			&::after {
				content: '';
				position: absolute;
				top: 25%;
				left: 0;
				width: 3px;
				height: 50%;
				background: var(--fs-accent-fill-default);
				border-radius: var(--fs-control-border-radius);
			}
		}
	}
</style>
