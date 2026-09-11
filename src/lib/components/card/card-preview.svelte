<script lang="ts">
	import type { CardPreviewProps } from './types.ts';
	import { getCardContext } from './card-context.svelte.ts';

	let { ref = $bindable(), logoSrc, class: classes, children, ...attrs }: CardPreviewProps = $props();

	const context = getCardContext();

	if (!context) throw new Error('Card context is not available. Make sure this component is used within a Card.');

	const { config, state: _state } = context;

	const { showFloatingAction } = config;

	const { orientation } = _state;
</script>

<div class={['fs-card-preview', showFloatingAction && 'with-action', orientation, classes]} bind:this={ref} {...attrs}>
	{@render children?.()}
	<img src={logoSrc} alt="Logo" class="fs-card-preview-logo" />
</div>

<style>
	.fs-card-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		/* 2nd child (After floating Checkbox) */
		&:first-child,
		&.with-action:nth-child(2) {
			border-radius: var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius) 0 0;
		}
		&:last-child {
			border-radius: 0 0 var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius);
		}
		&.horizontal {
			&:first-child,
			&.with-action:nth-child(2) {
				border-radius: var(--fs-control-overlay-border-radius) 0 0 var(--fs-control-overlay-border-radius);
			}
			&:last-child {
				border-radius: 0 var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius) 0;
			}
		}
		&:only-child {
			border-radius: var(--fs-control-overlay-border-radius);
		}
		& :global(img:not(.fs-card-preview-logo)) {
			width: 100%;
			height: auto;
		}
		& .fs-card-preview-logo {
			width: 32px;
			height: auto;
			position: absolute;
			bottom: 0.5rem;
			left: 0.5rem;
			z-index: 1;
		}
	}
</style>
