<script lang="ts">
	import panzoom from 'panzoom';
	import { SegmentedControl, SegmentedControlItem } from '#lib/index.js';
	import RenderShiki from '#site/components/render-shiki/render-shiki.svelte';
	import { getReducedMotion } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { m } from '#i18n/messages.js';
	import { getDisablePanZoom } from '#site/preferences.js';
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
		fluid = false,
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
		/** Lets the content shrink with the card, for components that fill the width they are given, instead of sizing the card to the content. */
		fluid?: boolean;
		children: Snippet;
	} = $props();

	// Panzoom swallows touch events so a drag pans instead of scrolling the page. That also
	// eats taps on anything interactive, so those targets opt out of the preventDefault.
	const INTERACTIVE =
		'a, button, input, select, textarea, label, summary, [role="button"], [role="option"], [role="menuitem"], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

	const isInteractive = (target: EventTarget | null) => target instanceof Element && !!target.closest(INTERACTIVE);

	const _panzoom = (options: PanZoomOptions): Attachment<HTMLElement> => {
		return (element) => {
			const transform = element.style.transform;
			const transformOrigin = element.style.transformOrigin;
			const restoreTransform = () => {
				element.style.transform = transform;
				element.style.transformOrigin = transformOrigin;
			};
			const parent = element.parentElement;
			const tabIndex = parent?.getAttribute('tabindex');
			const instance = panzoom(element, {
				...options,
				// returning false leaves the touch alone, so the tap reaches the control
				onTouch: (event: TouchEvent) => !isInteractive(event.target)
			});
			const changedTabIndex = parent?.getAttribute('tabindex') !== tabIndex;

			return () => {
				instance.on('transform', restoreTransform);
				instance.zoomTo(0, 0, 1);
				instance.dispose();
				restoreTransform();
				if (parent && changedTabIndex) {
					if (tabIndex == null) parent.removeAttribute('tabindex');
					else parent.setAttribute('tabindex', tabIndex);
				}
			};
		};
	};

	let view = $state('preview');
	const showCode = $derived(view === 'code');
	const sharedDisablePanZoom = getDisablePanZoom();
	const getMotionPreference = getReducedMotion();
	let reducedMotion = $derived(getMotionPreference());
	let effectiveDisabled = $derived(disablePanZoom || sharedDisablePanZoom.current);
</script>

<div class={['showcase-wrapper', code && 'has-code']}>
	{#if code}
		<SegmentedControl
			size="small"
			hideIndicator
			aria-label={m.showcase_display()}
			bind:selectedValue={view}
			class={['switch-view', { show: showCode }]}
		>
			<SegmentedControlItem value="preview">{m.showcase_preview()}</SegmentedControlItem>
			<SegmentedControlItem value="code">{m.showcase_view_code()}</SegmentedControlItem>
		</SegmentedControl>
		<div style={`display: ${code && showCode ? 'block' : 'none'};`}>
			<RenderShiki {code} />
		</div>
	{/if}
	<div
		class={['showcase', { backdrop: !effectiveDisabled }]}
		style:display={showCode ? 'none' : 'block'}
		style:min-height={minHeight}
		style:--showcase-overflow={showOverflow ? 'visible' : 'hidden'}
	>
		<div
			{@attach !effectiveDisabled &&
				!reducedMotion &&
				!showCode &&
				_panzoom({
					minZoom,
					maxZoom,
					bounds: true,
					initialZoom,
					smoothScroll: true,
					autocenter: autoCenter,
					boundsPadding: 0
				})}
			class={['inner', { fluid }]}
		>
			<div
				class={['showcase-grid', { fluid }]}
				style={`grid-template-columns: ${((fluid ? 'minmax(0, 1fr)' : columnWidth) + ' ').repeat(columns)}; grid-auto-rows: auto; grid-gap: ${gap};`}
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
		min-height: 280px;
		width: 100%;
		min-width: 0;
		overflow: var(--showcase-overflow);
		border-radius: var(--fs-control-overlay-border-radius);
		background-clip: padding-box;
		background-color: var(--fs-card-background-default);
		border: 1px solid var(--fs-card-stroke-default);
		box-shadow: var(--fs-shadow-card);
		&.backdrop {
			background-image: radial-gradient(var(--fs-control-stroke-secondary) 1px, transparent 1px);
			background-size: 12px 12px;
		}
		@media (max-width: 600px) {
			overflow: auto;
			overscroll-behavior-inline: contain;
		}
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
	.inner.fluid {
		min-width: 0;
	}
	.showcase-grid.fluid {
		flex: 1;
		min-width: 0;
	}
	.showcase-grid {
		transform-origin: 40% 40%;
		margin: 3rem;
		position: relative;
		display: grid;
		place-items: center;

		/* A 3rem gutter costs 96px of a phone's width, which is enough to push
		   fixed-width components past the edge of the card. */
		@media (max-width: 768px) {
			margin: 1.5rem 0.5rem;
		}
	}
	.showcase-wrapper :global(.switch-view) {
		z-index: 2;
		position: absolute;
		top: 14px;
		right: 5px;
		transition: right var(--fs-normal-duration) var(--fs-point-to-point);
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}
	.showcase-wrapper :global(.switch-view.show) {
		right: 45px;
	}
</style>
