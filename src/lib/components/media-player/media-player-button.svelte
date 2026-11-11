<script lang="ts">
	import Button from '../button/button.svelte';
	import Tooltip from '../tooltip/tooltip.svelte';
	import { TOOLTIP_POSITION } from './utils.ts';
	import type { MediaPlayerButtonProps } from './types.ts';

	let {
		label,
		tooltipPlacement = 'top',
		hideTooltip = false,
		ref = $bindable(null),
		class: classes,
		children: icon,
		...attributes
	}: MediaPlayerButtonProps = $props();

	let tooltipOpen = $state(false);

	// The tooltip stays closed while the button has a popup open: both would cover the same spot.
	$effect.pre(() => {
		if (hideTooltip && tooltipOpen) tooltipOpen = false;
	});
</script>

<!-- @component
  An icon button for the transport controls of a MediaPlayer, named by `label` and showing it in a tooltip.
  - Usage:
    ```tsx
    <MediaPlayerButton label="Share" onclick={share}><ShareRegular /></MediaPlayerButton>
    ```
-->
<!-- `aria-label` names the button and the tooltip only shows that name. It closes at once, and the tooltips of
     neighbouring buttons never overlap. -->
<Tooltip
	content={label}
	placement={tooltipPlacement}
	relationship="inaccessible"
	hideDelay={0}
	positionConfig={TOOLTIP_POSITION}
	withArrow
	bind:open={tooltipOpen}
>
	{#snippet children(_, attach)}
		<Button
			{...attributes}
			appearance="subtle"
			class={['fs-media-player-button', classes]}
			aria-label={label}
			bind:ref={() => ref, (element) => (ref = element as HTMLButtonElement | null)}
			{@attach attach}
		>
			{@render icon?.()}
		</Button>
	{/snippet}
</Tooltip>

<style>
	:global(.fs-button.fs-media-player-button) {
		width: 2rem;
		min-width: 2rem;
		height: 2rem;
		padding: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		& :global(svg) {
			width: 1rem;
			height: 1rem;
		}
		&:global(.play svg) {
			width: 1.25rem;
			height: 1.25rem;
		}
		&:global([aria-pressed='true']) {
			background: var(--fs-subtle-fill-secondary);
		}
	}
</style>
