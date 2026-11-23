<script lang="ts">
	import { Button } from '#lib/index.js';
	import CheckmarkRegular from 'fluentui-icons-svelte/CheckmarkRegular.svelte';
	import { m } from '#i18n/messages.js';
	import { defaultAccent } from '#site/utils/accent-ramp.js';
	import { getTabspotAttributes, type TabspotNodeOptions } from 'tabspot';
	import { attachTabspot } from '#components/list-view/utils.js';

	let { accent, select }: { accent: string; select: (color: string) => void } = $props();

	const colors = [
		[defaultAccent, m.site_blue],
		['#038387', m.site_teal],
		['#8764B8', m.site_purple],
		['#C239B3', m.site_pink],
		['#D13438', m.site_red],
		['#CA5010', m.site_orange],
		['#107C10', m.site_green],
		['#5D6B73', m.site_graphite]
	] as const;
	const keyboard: TabspotNodeOptions = {
		root: {},
		mover: { axis: 'horizontal', cyclic: true, items: 'button', activation: { mode: 'focus', roving: true } }
	};
</script>

<div
	class="presets"
	role="group"
	aria-label={m.site_accent_presets()}
	{...getTabspotAttributes(keyboard)}
	{@attach attachTabspot(keyboard)}
>
	{#each colors as [color, label] (color)}
		<Button
			appearance="subtle"
			aria-label={label()}
			aria-pressed={accent === color}
			title={label() + ' ' + color}
			onclick={() => select(color)}
		>
			<span class="swatch" style:background={color}>
				{#if accent === color}<CheckmarkRegular width="0.92rem" aria-hidden="true" />{/if}
			</span>
		</Button>
	{/each}
</div>

<style>
	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;

		& :global(.fs-button) {
			min-inline-size: 2.125rem;
			min-block-size: 2.125rem;
			padding: 0.125rem;
		}

		& :global([aria-pressed='true']) {
			outline: 2px solid var(--fs-accent-text-primary);
			outline-offset: 1px;
		}
	}

	.swatch {
		display: grid;
		place-items: center;
		width: 1.8rem;
		aspect-ratio: 1;
		color: #fff;
		border-radius: var(--fs-control-border-radius);
		border: 1px solid var(--fs-control-stroke-default);
	}
</style>
