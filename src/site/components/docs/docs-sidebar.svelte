<script lang="ts">
	import { Badge, SideNav, SideNavBranch, SideNavItem } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { componentGroups, componentPath, docsPages, typesPage } from '#site/utils/docs-navigation.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	import { statusBadge } from '#site/utils/status.js';

	let { path, picked }: { path: string; picked?: () => void } = $props();
</script>

<SideNav label={m.site_docs_navigation()} width="100%" showToggle={false} class="documentation-rail">
	{#each docsPages as { url, label, icon } (url)}
		<SideNavItem
			href={localizedPath(url)}
			label={label()}
			{icon}
			active={path === url}
			aria-current={path === url ? 'page' : undefined}
			onclick={picked}
		/>
	{/each}

	{#each componentGroups as { id, label, items } (id)}
		{#if items.length}
			<SideNavBranch label={label()} expanded>
				{#each items as item (item.slug)}
					{@const url = componentPath(item.slug)}
					<SideNavItem
						href={localizedPath(url)}
						label={item.title}
						active={path === url}
						aria-current={path === url ? 'page' : undefined}
						onclick={picked}
					>
						<span class="rail-title">{item.title}</span>
						{#if item.status}
							{@const badge = statusBadge(item.status)}
							<Badge shape="rounded" appearance={badge.appearance} color={badge.color} title={badge.message}
								>{badge.label}</Badge
							>
						{/if}
					</SideNavItem>
				{/each}
			</SideNavBranch>
		{/if}
	{/each}

	<SideNavItem
		href={localizedPath(typesPage.url)}
		label={typesPage.label()}
		active={path === typesPage.url}
		aria-current={path === typesPage.url ? 'page' : undefined}
		onclick={picked}
	/>
</SideNav>

<style>
	.rail-title {
		min-width: 0;
		flex: 1;
	}
	:global(.documentation-rail) {
		--fs-list-item-icon-size: 1rem;
	}
</style>
