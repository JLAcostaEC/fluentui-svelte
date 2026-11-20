<script lang="ts">
	import { SegmentedControl, SegmentedControlItem } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import Command from '#site/components/command.svelte';

	const installers = {
		pnpm: 'pnpm add -D fluentui-svelte',
		npm: 'npm i -D fluentui-svelte',
		yarn: 'yarn add -D fluentui-svelte',
		bun: 'bun add -d fluentui-svelte'
	} as const;

	let manager = $state('pnpm');
	const command = $derived(installers[manager as keyof typeof installers] ?? installers.pnpm);
</script>

<div class="install-options">
	<SegmentedControl size="small" hideIndicator aria-label={m.site_gs_package_manager()} bind:selectedValue={manager}>
		{#each Object.keys(installers) as name (name)}
			<SegmentedControlItem value={name}>{name}</SegmentedControlItem>
		{/each}
	</SegmentedControl>

	<Command {command} terminal />
</div>

<style>
	.install-options {
		display: grid;
		justify-items: start;
		gap: 0.75rem;
		width: 100%;
		min-width: 0;
	}
</style>
