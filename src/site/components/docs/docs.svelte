<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AutoSuggestBox, AutoSuggestBoxOption, ListView, ListViewItem, Badge, Button } from '$lib/index.js';
	import { resolve } from '$app/paths';
	import Toc from '../../components/toc/toc.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { dev } from '$app/environment';
	import EditRegular from 'fluentui-icons-svelte/EditRegular.svelte';
	import { localizeHref, deLocalizeUrl } from '$i18n/runtime.js';

	const GITHUB_REPO_URL = 'https://github.com/JLAcostaEC/fluentui-svelte';

	// Resolves the source file that documents the current route so it can be linked directly on GitHub.
	// The pathname must be de-localized first since i18n may prefix it with a locale segment (e.g. /es/docs/...).
	const editUrl = $derived.by(() => {
		const pathname = deLocalizeUrl(page.url).pathname;
		const componentSlug = pathname.match(/^\/docs\/components\/(.+)$/);

		let filePath: string;
		if (componentSlug) {
			filePath = `src/site/documentation/${componentSlug[1]}.svx`;
		} else if (pathname === '/docs/getting-started') {
			filePath = 'src/routes/docs/getting-started/+page.svx';
		} else {
			filePath = 'src/routes/docs/+page.svx';
		}
		return `${GITHUB_REPO_URL}/edit/main/${filePath}`;
	});

	type Navigation = {
		label: string;
		url: string;
		status: string | null;
	};

	let {
		children,
		primaryNavigation,
		secondaryNavigation
	}: { children: Snippet; primaryNavigation: Navigation[]; secondaryNavigation: Navigation[] } = $props();

	const suggestions = $derived.by(() => {
		const nav = primaryNavigation.map((nav) => nav.label);
		nav.push(...secondaryNavigation.map((nav) => nav.label));
		return nav;
	});

	const handleNav = async (item: string) => {
		const navItem =
			primaryNavigation.find((nav) => nav.label === item) || secondaryNavigation.find((nav) => nav.label === item);

		if (navItem) {
			goto(resolve(localizeHref(navItem.url)));
		}
	};

	const badgeStyle = (item: string) => {
		switch (item) {
			case 'AI':
				return { appearance: 'tint', color: 'success' };
			case 'Experimental':
				return { appearance: 'tint', color: 'warning' };
			case 'New':
				return { appearance: 'filled', color: 'attention' };
			case 'WIP':
				return { appearance: 'tint', color: 'attention' };
			case 'Empty':
				return { appearance: 'tint', color: 'information' };
			default:
				return { appearance: 'tint', color: 'critical' };
		}
	};
</script>

<section class="container">
	<aside id="navigation">
		<AutoSuggestBox suggestionChosen={(e, item) => handleNav(item)}>
			{#each suggestions as suggestion, index (suggestion)}
				<AutoSuggestBoxOption {index} value={suggestion}>{suggestion}</AutoSuggestBoxOption>
			{/each}
		</AutoSuggestBox>

		<nav id="navigation-list">
			{#if primaryNavigation}
				<ListView role="menu">
					{#each primaryNavigation as nav (nav.label)}
						<ListViewItem
							role="menuitem"
							as="a"
							href={resolve(localizeHref(nav.url))}
							active={page.url.pathname === nav.url}
						>
							{nav.label}
						</ListViewItem>
					{/each}
				</ListView>
			{/if}

			<h3>Components</h3>

			{#if secondaryNavigation}
				<ListView role="menu">
					{#each secondaryNavigation as doc (doc.label)}
						{#if doc.status !== 'Empty' || dev}
							<ListViewItem
								role="menuitem"
								as="a"
								href={resolve(localizeHref(doc.url))}
								active={page.url.pathname === doc.url}
							>
								{doc.label}
								{#if doc.status}
									<Badge {...badgeStyle(doc.status) as any}>
										{doc.status}
									</Badge>
								{/if}
							</ListViewItem>
						{/if}
					{/each}
				</ListView>
			{/if}
		</nav>
	</aside>

	<article id="docs">
		{#key page.url.pathname}
			<div class="docs-content" in:fly={{ y: 200, duration: 500, delay: 500 }} out:fly={{ y: 200, duration: 500 }}>
				{@render children?.()}
			</div>
		{/key}
	</article>

	<aside id="table-of-contents">
		<Button as="a" href={editUrl} target="_blank" rel="noopener noreferrer" appearance="subtle">
			<EditRegular />
			Edit this Doc
		</Button>
		<Toc selector="#docs > div" />
	</aside>
</section>

<style>
	.container {
		display: grid;
		grid-template-columns: auto 3fr auto;
		gap: 1rem;
		padding: 2rem;
		width: 100%;
		& #navigation {
			border-right: 1px solid var(--fs-control-stroke-default);
			padding: 1rem 2rem 1rem 0;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			& :global(.fs-auto-suggest-box) {
				width: 100%;
			}
			& #navigation-list {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				& :global(.fs-list-view-item) {
					margin: 0.3rem 0;
				}
			}
			& h3 {
				font-size: 1.2rem;
				padding-left: 0.6rem;
			}
		}
		& #docs {
			min-width: 10rem;
			& > .docs-content {
				padding: 1rem 1rem;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				gap: 1rem;
				width: 100%;
				& > :global(p),
				& > :global(*) {
					font-size: var(--fs-body-font-size);
					line-height: var(--fs-body-line-height);
				}
				& :global(code span) {
					font-size: inherit;
				}
				& > :global(h1) {
					font-size: 3rem;
					line-height: var(--fs-title-large-line-height);
					font-weight: 600;
				}
				& > :global(h2) {
					font-size: var(--fs-title2-font-size);
					line-height: var(--fs-title2-line-height);
					font-weight: 600;
				}
				& > :global(h3) {
					font-size: var(--fs-title3-font-size);
					line-height: var(--fs-title3-line-height);
					font-weight: 600;
				}
			}
		}
		& #table-of-contents {
			padding-top: 1rem;
			padding: 1rem 0rem 1rem 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			& :global(.fs-button) {
				width: 100%;
			}
			& :global(.fs-button svg) {
				width: 1rem;
				height: auto;
			}
		}
	}
</style>
