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
						class="rail-link"
						href={localizedPath(url)}
						label={item.title}
						active={path === url}
						aria-current={path === url ? 'page' : undefined}
						onclick={picked}
					>
						<span class="rail-entry">
							<span class="rail-title">{item.title}</span>
							{#if item.status}
								{@const badge = statusBadge(item.status)}
								<Badge
									shape="rounded"
									appearance={badge.appearance}
									size={16}
									color={badge.color}
									title={badge.message}
								>
									<span class="rail-status">{badge.label}</span>
								</Badge>
							{/if}
						</span>
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
	.rail-entry {
		display: flex;
		align-items: center;
		gap: 0.3rem;

		& .rail-title {
			min-inline-size: 0;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		& :global(.fs-badge) {
			flex: none;
		}
	}
	.rail-status {
		text-box: trim-both cap alphabetic;

		@supports not (text-box: trim-both cap alphabetic) {
			translate: 0 -0.15em;
		}
	}
	:global(.documentation-rail) {
		--fs-list-item-icon-size: 1rem;

		& :global(.rail-link) {
			padding-block: 0.34rem;
		}
	}
</style>
