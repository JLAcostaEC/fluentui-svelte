<script lang="ts">
	import panzoom from 'panzoom';
	import ToggleSwitch from '$components/toggle-switch/toggle-switch.svelte';
	import RenderShiki from '$site/components/render-shiki/render-shiki.svelte';
	import { m } from '$i18n/messages.js';
	import type { Snippet } from 'svelte';
	import type { PanZoomOptions } from 'panzoom';
	import type { Attachment } from 'svelte/attachments';

	let {
		columnWidth = '1fr',
		columns = 3,
		gap = '32px',
		initialZoom = 1,
		minHeight = '200px',
		minZoom = 0.5,
		maxZoom = 20,
		autoCenter = false,
		code,
		disablePanZoom = false,
		showOverflow = false,
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
		code: string;
		disablePanZoom?: boolean;
		showOverflow?: boolean;
		children: Snippet;
	} = $props();

	const _panzoom = (options: PanZoomOptions): Attachment<HTMLElement> => {
		return (element) => {
			const instance = panzoom(element, options);

			return () => {
				instance.dispose();
			};
		};
	};

	let showCode = $state(false);
</script>

<div class={['showcase-wrapper', code && 'has-code']}>
	{#if code}
		<ToggleSwitch
			label={m.showcase_view_code()}
			bind:checked={showCode}
			labelAttributes={{ class: `switch-view ${showCode ? 'show' : ''}` }}
		/>
		<div style={`display: ${code && showCode ? 'block' : 'none'};`}>
			<RenderShiki {code} />
		</div>
	{/if}
	<div
		class="showcase"
		style={`display: ${!showCode ? 'block' : 'none'};; min-height: ${minHeight}; overflow: ${showOverflow ? 'visible' : 'hidden'}`}
	>
		<div
			{@attach !disablePanZoom &&
				_panzoom({
					minZoom,
					maxZoom,
					bounds: true,
					initialZoom,
					smoothScroll: true,
					autocenter: autoCenter,
					boundsPadding: 0
				})}
			class="inner"
		>
			{#if !disablePanZoom}
				<svg class="showcase-backdrop">
					<pattern
						id="showcase-backdrop-pattern"
						x="5.800038310074086"
						y="6.229276141719765"
						width="11.17258097342026"
						height="11.17258097342026"
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx="0.2979354926245403"
							cy="0.2979354926245403"
							r="0.2979354926245403"
							fill="var(--fds-text-disabled)"
						></circle>
					</pattern>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#showcase-backdrop-pattern)"></rect>
				</svg>
			{/if}
			<div
				class="showcase-grid"
				style={`grid-template-columns: ${(columnWidth + ' ').repeat(columns)}; grid-auto-rows: auto; grid-gap: ${gap};`}
			>
				{@render children?.()}
			</div>
		</div>
	</div>
</div>

<style>
	.showcase-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: relative;
		&.has-code :global(.shiki) {
			padding: 4rem 1rem 1rem !important;
		}
	}
	.showcase {
		position: relative;
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
		flex: 1;
		align-items: center;
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		min-width: max-content;
		min-height: 100%;
		max-width: 100%;
	}
	.showcase-grid {
		transform-origin: 40% 40%;
		margin: 3rem;
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
	:global(.switch-view) {
		z-index: 2;
		position: absolute;
		top: 14px;
		right: 5px;
		transition: right var(--fs-normal-duration) var(--fs-point-to-point);
		&::before {
			content: '';
			position: absolute;
			inset: -0.25rem;
			z-index: -1;
			border-radius: 999px;
			padding: 0.5rem;
			backdrop-filter: blur(8px);
		}
		&.show {
			right: 45px;
		}
	}
</style>
