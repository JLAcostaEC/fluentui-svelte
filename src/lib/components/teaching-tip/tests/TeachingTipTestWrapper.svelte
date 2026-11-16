<script lang="ts">
	import { TeachingTip, TeachingTipPreview, TeachingTipHeader, TeachingTipFooter } from '#lib/index.js';
	import type { TeachingTipHeaderProps, TeachingTipProps } from '#lib/components/teaching-tip/types.js';

	let {
		open = $bindable(true),
		withTarget = false,
		targetOffset = 0,
		headerProps = {},
		...props
	}: Partial<TeachingTipProps> & {
		/** Anchors the teaching tip to a button rendered next to it. */
		withTarget?: boolean;
		/** Moves the target to the right, in pixels. */
		targetOffset?: number;
		headerProps?: Partial<TeachingTipHeaderProps>;
	} = $props();

	let target: HTMLButtonElement | null = $state(null);
</script>

{#snippet action()}
	<button data-testid="action">Got it</button>
{/snippet}

{#if withTarget}
	<button data-testid="target" style="margin: 12rem 0 0 {targetOffset}px" bind:this={target}>Target</button>
{/if}
<button data-testid="outside">Outside</button>

<TeachingTip bind:open target={withTarget ? target : null} placement="bottom" data-testid="teaching-tip" {...props}>
	<TeachingTipPreview data-testid="preview"><span>Preview</span></TeachingTipPreview>
	<TeachingTipHeader title="Tip title" {...headerProps} />
	<p>Tip content</p>
	<TeachingTipFooter {action} data-testid="footer" />
</TeachingTip>
