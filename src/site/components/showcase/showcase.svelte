<script lang="ts">
	import type { Snippet } from 'svelte';
	import panzoom from 'panzoom';
	import type { PanZoomOptions } from 'panzoom';
	import type { Action } from 'svelte/action';

	let {
		columnWidth = '1fr',
		columns = 3,
		gap = '32px',
		initialZoom = 1,
		minHeight = '200px',
		minZoom = 0.5,
		maxZoom = 20,
		autoCenter = false,
		children
	}: {
		columns: number;
		minHeight: string;
		columnWidth: string;
		initialZoom: number;
		gap: string;
		minZoom: number;
		maxZoom: number;
		autoCenter: boolean;
		children: Snippet;
	} = $props();

	const _panzoom: Action<HTMLElement, PanZoomOptions> = (node, options) => {
		const instance = panzoom(node, options);
		return {
			destroy() {
				instance.dispose();
			}
		};
	};
</script>

<div class="showcase" style="min-height: {minHeight};">
	<div
		use:_panzoom={{
			minZoom,
			maxZoom,
			bounds: true,
			initialZoom,
			smoothScroll: true,
			autocenter: autoCenter,
			boundsPadding: 0
		}}
		class="inner"
	>
		<svg class="showcase-backdrop">
			<pattern
				id="pattern-14333"
				x="5.800038310074086"
				y="6.229276141719765"
				width="11.17258097342026"
				height="11.17258097342026"
				patternUnits="userSpaceOnUse"
			>
				<circle cx="0.2979354926245403" cy="0.2979354926245403" r="0.2979354926245403" fill="var(--fds-text-disabled)"
				></circle>
			</pattern>
			<rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-14333)"></rect>
		</svg>
		<div
			class="showcase-grid"
			style={`grid-template-columns: ${(columnWidth + ' ').repeat(columns)}; grid-auto-rows: auto; grid-gap: ${gap};`}
		>
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.showcase {
		position: relative;
		overflow: hidden;
		outline: none;
		contain: layout;
		min-height: 280px;
		width: 100%;
		border-radius: var(--fs-control-overlay-border-radius);
		background-clip: padding-box;
		background-color: var(--fs-card-background-default);
		border: 1px solid var(--fs-card-stroke-default);
		box-shadow: var(--fs-shadow-card);
		z-index: 1;
	}
	.inner {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		min-width: max-content;
		min-height: max-content;
		max-width: 100%;
	}
	.showcase-grid {
		transform-origin: 40% 40%;
		margin: 24px;
		position: relative;
		display: grid;
		place-items: center;
	}
	.showcase-backdrop {
		width: 600%;
		max-width: unset;
		height: 600%;
		position: absolute;
		inset: 0;
		z-index: -1;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.5;
	}
</style>
