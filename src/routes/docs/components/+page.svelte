<script lang="ts">
	import { Badge, Card, TextBox } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { componentGroups, componentPath } from '#site/utils/docs-navigation.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	import { statusBadge } from '#site/utils/status.js';
	import Seo from '#site/components/seo/seo.svelte';

	let query = $state<string | number | null>('');
	const filter = $derived(
		String(query ?? '')
			.trim()
			.toLowerCase()
	);
	const groups = $derived(
		componentGroups
			.map((group) => ({
				...group,
				items: group.items.filter((meta) => (meta.title + ' ' + meta.slug).toLowerCase().includes(filter))
			}))
			.filter((group) => group.items.length)
	);
	const count = $derived(groups.reduce((total, group) => total + group.items.length, 0));
</script>

<Seo title={m.docs_nav_title()} description={m.site_component_index_text()} />

<h1>{m.docs_nav_title()}</h1>
<p>{m.site_component_index_text()}</p>
<div class="filter-bar">
	<TextBox
		type="search"
		placeholder={m.site_docs_filter()}
		aria-label={m.site_docs_filter()}
		bind:value={query}
		hideActionButtons
	/>
	<span role="status">{m.site_docs_component_results({ count: String(count) })}</span>
</div>

{#each groups as { id, label, items } (id)}
	<h2 {id}>{label()}</h2>
	<div class="site-card-grid component-index">
		{#each items as item (item.slug)}
			<Card
				as="a"
				href={localizedPath(componentPath(item.slug))}
				appearance="filled"
				orientation="horizontal"
				class="component-card"
			>
				{#if item.icon}<item.icon width="1.25rem" height="1.25rem" aria-hidden="true" />{/if}
				<span class="component-title">{item.title}</span>
				{#if item.status}
					{@const badge = statusBadge(item.status)}
					<Badge appearance={badge.appearance} color={badge.color} shape="rounded">{badge.label}</Badge>
				{/if}
			</Card>
		{/each}
	</div>
{:else}
	<p role="status">{m.site_docs_no_results()}</p>
{/each}

<style>
	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.84rem;
		color: var(--fs-text-secondary);
	}
	.component-title {
		flex: 1;
	}
	.component-index {
		width: 100%;
		& :global(.component-card) {
			flex-wrap: wrap;
			align-items: center;
			color: var(--fs-text-primary);
			text-decoration: none;
		}
	}
</style>
