<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AutoSuggestBox, AutoSuggestBoxOption, ListView, ListViewItem, Badge, Button, Tooltip } from '$lib/index.js';
	import { resolve } from '$app/paths';
	import Toc from '../../components/toc/toc.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { dev } from '$app/environment';
	import EditRegular from 'fluentui-icons-svelte/EditRegular.svelte';
	import { localizeHref, deLocalizeUrl } from '$i18n/runtime.js';
	import type { Meta } from '$types';
	import { GITHUB_REPO_URL } from '$site/constants.js';
	import { m } from '$i18n/messages.js';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';

	const globalContext = getGlobalFSContext();

	const { state: globalState } = globalContext!;

	// Resolves the GitHub link that documents the current route.
	const editUrl = $derived.by(() => {
		const pathname = deLocalizeUrl(page.url).pathname;
		const componentSlug = pathname.match(/^\/docs\/components\/(.+)$/);

		if (componentSlug) {
			return `${GITHUB_REPO_URL}/tree/main/src/lib/components/${componentSlug[1]}/docs`;
		}

		const filePath =
			pathname === '/docs/getting-started' ? 'src/routes/docs/getting-started/+page.svx' : 'src/routes/docs/+page.svx';
		return `${GITHUB_REPO_URL}/edit/main/${filePath}`;
	});

	type NavLink = {
		label: string;
		url: string;
		status?: string | null;
		icon?: any;
	};

	let {
		children,
		primaryNavigation,
		secondaryNavigation
	}: { children: Snippet; primaryNavigation: NavLink[]; secondaryNavigation: Meta[] } = $props();

	// Component navigation is derived from each component's META (title + slug).
	const componentLinks = $derived<NavLink[]>(
		secondaryNavigation.map((meta) => ({
			label: meta.title,
			url: `/docs/components/${meta.slug}`,
			status: meta.status,
			icon: meta.icon
		}))
	);

	const suggestions = $derived([...primaryNavigation, ...componentLinks].map((nav) => nav.label));

	const handleNav = async (item: string) => {
		const navItem = [...primaryNavigation, ...componentLinks].find((nav) => nav.label === item);

		if (navItem) {
			goto(resolve(localizeHref(navItem.url) as any));
		}
	};

	const badgeStyle = (item: string) => {
		switch (item) {
			case 'AI':
				return {
					appearance: 'tint',
					color: 'success',
					message: m.docs_status_ai()
				};
			case 'Experimental':
				return {
					appearance: 'tint',
					color: 'warning',
					message: m.docs_status_experimental()
				};
			case 'New':
				return { appearance: 'filled', color: 'attention', message: m.docs_status_new() };
			case 'Beta':
			case 'WIP':
				return {
					appearance: 'tint',
					color: 'attention',
					message: m.docs_status_wip()
				};
			case 'Empty':
				return {
					appearance: 'tint',
					color: 'information',
					message: m.docs_status_empty()
				};
			case 'Prototype':
				return {
					appearance: 'tint',
					color: 'critical',
					message: m.docs_status_prototype()
				};
			default:
				return { appearance: 'tint', color: 'critical', message: '' };
		}
	};
</script>

<section class="container">
	<aside id="navigation">
		<div id="search-box" style="width: 100%; max-width: 100%; display: flex; flex-grow: 0;">
			<AutoSuggestBox suggestionChosen={(e, item) => handleNav(item)} placeholder={m.docs_search_placeholder()}>
				{#each suggestions as suggestion, index (suggestion)}
					<AutoSuggestBoxOption {index} value={suggestion}>{suggestion}</AutoSuggestBoxOption>
				{/each}
			</AutoSuggestBox>
		</div>

		<nav class="navigation-list">
			{#if primaryNavigation}
				<ListView role="menu">
					{#each primaryNavigation as nav (nav.label)}
						<ListViewItem
							role="menuitem"
							as="a"
							href={resolve(localizeHref(nav.url) as any)}
							active={page.url.pathname.endsWith(nav.url)}
						>
							{nav.label}
						</ListViewItem>
					{/each}
				</ListView>
			{/if}
		</nav>

		<h3>{m.docs_nav_title()}</h3>

		<nav class="navigation-list">
			{#if componentLinks}
				<ListView role="menu">
					{#each componentLinks as doc (doc.label)}
						{#if doc.status !== 'Empty' || dev}
							<ListViewItem
								role="menuitem"
								as="a"
								href={resolve(localizeHref(doc.url) as any)}
								active={page.url.pathname.endsWith(doc.url)}
							>
								{#if doc.icon}
									<doc.icon width="1.2rem" />
								{/if}
								{doc.label}
								{#if doc.status}
									{@const bagdeData = badgeStyle(doc.status)}
									{let tooltipTarget: HTMLElement | null = $state(null)}

									<Badge bind:ref={tooltipTarget} {...bagdeData as any}>
										{doc.status}
									</Badge>
									{#if bagdeData.message && tooltipTarget}
										<Tooltip
											style="max-width: 200px; text-align: center;"
											target={tooltipTarget}
											content={bagdeData.message}
											withArrow
										/>
									{/if}
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
			<div
				class="docs-content"
				in:fly={!globalState.reducedMotion ? { y: 50, duration: 333, delay: 333 } : { duration: 0 }}
				out:fly={!globalState.reducedMotion ? { y: 50, duration: 333 } : { duration: 0 }}
			>
				{@render children?.()}
			</div>
		{/key}
	</article>

	<aside id="table-of-contents">
		<Button as="a" href={editUrl} target="_blank" rel="noopener noreferrer" appearance="subtle">
			<EditRegular />
			{m.docs_edit_button()}
		</Button>
		<Toc selector="#docs > div" />
	</aside>
</section>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 3fr 0.8fr;
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
			& .navigation-list {
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

		/* Tablet: drop the table of contents and collapse to navigation + docs. */
		@media (max-width: 1024px) {
			grid-template-columns: minmax(0, auto) minmax(0, 1fr);
			padding: 1.5rem;
			& #table-of-contents {
				display: none;
			}
		}

		/* Mobile: single column with the navigation stacked above the docs. */
		@media (max-width: 768px) {
			grid-template-columns: minmax(0, 1fr);
			padding: 1rem;
			gap: 0.75rem;
			& #navigation {
				border-right: none;
				border-bottom: 1px solid var(--fs-control-stroke-default);
				padding: 0 0 1rem 0;
				/* On mobile only the search box stays; the nav lists are hidden. */
				& .navigation-list,
				& h3 {
					display: none;
				}
			}
			& #docs > .docs-content {
				padding: 1rem 0;
				& > :global(h1) {
					font-size: 2rem;
				}
				/* Props tables: drop the Description column so the rest of the table fits. */
				& :global(table.fs-docs :is(th, td):nth-child(4)) {
					display: none;
				}
			}
		}
	}
</style>
