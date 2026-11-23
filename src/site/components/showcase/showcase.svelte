<script lang="ts">
	import panzoom from 'panzoom';
	import { MediaQuery } from 'svelte/reactivity';
	import { SegmentedControl, SegmentedControlItem } from '#lib/index.js';
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
	const narrowScreen = new MediaQuery('(max-width: 900px)');
	const reducedMotion = $derived(getMotionPreference());
	const effectiveDisabled = $derived(disablePanZoom || sharedDisablePanZoom.current || narrowScreen.current);
	const fixedWidth = $derived(!fluid && /^\d+(?:\.\d+)?px$/.test(columnWidth) ? columnWidth : undefined);
</script>

<div class="showcase-wrapper">
	{#if code}
		<SegmentedControl
			size="small"
			hideIndicator
			aria-label={m.showcase_display()}
			bind:selectedValue={view}
			class="switch-view"
		>
			<SegmentedControlItem value="preview">{m.showcase_preview()}</SegmentedControlItem>
			<SegmentedControlItem value="code">{m.showcase_view_code()}</SegmentedControlItem>
		</SegmentedControl>
		{#if showCode}
			{#await import('#site/components/render-shiki/render-shiki.svelte')}
				<pre class="shiki"><code>{code.trim()}</code></pre>
			{:then { default: RenderShiki }}
				<RenderShiki {code} />
			{/await}
		{/if}
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
			class="inner"
		>
			<div
				class="showcase-grid"
				style:--showcase-column-size={fixedWidth}
				style:--showcase-grid-size={columns === 1 ? fixedWidth : undefined}
				style:--showcase-columns={columns}
				style:--showcase-gap={gap}
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
		container-type: inline-size;
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
			background-image: radial-gradient(
				color-mix(in srgb, var(--fs-control-stroke-secondary) 50%, transparent) 1px,
				transparent 1px
			);
			background-size: 12px 12px;
		}
	}
	.inner {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		place-items: center;
		position: relative;
		min-height: 100%;
		min-width: 0;
		padding: clamp(0.75rem, 3cqi, 2rem);
	}
	.showcase-grid {
		--column-gap: min(var(--showcase-gap), 3cqi);
		--column-share: (100% - (var(--showcase-columns) - 1) * var(--column-gap)) / var(--showcase-columns);
		display: grid;
		inline-size: min(100%, var(--showcase-grid-size, 100%));
		grid-template-columns: repeat(
			auto-fit,
			minmax(min(100%, max(var(--showcase-column-size, 10rem), var(--column-share))), 1fr)
		);
		gap: var(--column-gap);
		place-items: center;
		& > :global(*),
		& :global(.fs-app-window),
		& :global(.fs-flip-view) {
			max-inline-size: 100%;
			min-inline-size: 0;
		}
		& :global(.fs-top-nav),
		& :global(.fs-tab-view) {
			max-inline-size: 100%;
			overflow-x: auto;
			scrollbar-width: thin;
		}
	}
	.showcase-wrapper :global(.switch-view) {
		align-self: end;
		margin-block-end: 0.4rem;
	}
	@media (max-width: 900px) {
		.showcase {
			overflow: auto;
			overscroll-behavior-inline: contain;
		}
	}
	@media (max-width: 360px) {
		.inner {
			padding-inline: 0.5rem;
		}
	}
</style>
