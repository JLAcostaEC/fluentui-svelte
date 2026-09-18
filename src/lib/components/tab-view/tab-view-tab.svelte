<script lang="ts">
	import { invokeHandlers, RenderSoC } from '$internal';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { COMPONENT_NAME, requireTabViewContext } from './tab-view.svelte.ts';
	import type { TabViewTabProps } from './types.ts';

	const ID = $props.id();

	let {
		ref = $bindable(),
		value = `${COMPONENT_NAME}-${ID}`,
		icon,
		closable,
		disabled,
		onClose,
		onclick,
		onkeydown,
		class: classes,
		children,
		...attributes
	}: TabViewTabProps = $props();

	const context = requireTabViewContext();

	const active = $derived(context.state.activeTab === value);

	/** The tab decides for itself, and falls back to what the strip asked of every one of them. */
	const _closable = $derived(closable ?? context.config.closable);

	const close = (event: Event) => {
		onClose?.(event, value);
		context.methods.closeTab(event, value);
	};

	/**
	 * A `div` carries the tab, because a `button` cannot hold the close `button` a browser tab has.
	 * That costs the keys a button would have answered on its own, so they are handled here:
	 * `Enter`/`Space` select, and `Delete` closes — the tabs pattern reserves it for exactly that.
	 *
	 * The close button is held out of the tab order, so the strip stays a single tab stop. `Delete`
	 * is what reaches it from the keyboard, which is why the key is bound even while the pointer
	 * has a button of its own.
	 */
	const onTabKeydown = (event: KeyboardEvent) => {
		// A key spent inside the close button is already answered; only the tab itself speaks here.
		if (event.target !== event.currentTarget || event.defaultPrevented) return;

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			context.methods.setActiveTab(event, value);
		} else if (event.key === 'Delete' && _closable) {
			event.preventDefault();
			close(event);
		}
	};
</script>

<!--
	@component
	A single tab of a `TabView`. It reports its own selection, and can carry an icon and a close
	button.

	- Usage:
	```tsx
	<script>
		import { TabView, TabViewTab } from 'fluentui-svelte';
		import { DocumentRegular } from 'fluentui-icons-svelte';
	</script>

	<TabView activeTab="notes">
		<TabViewTab value="notes" icon={DocumentRegular} closable>Notes</TabViewTab>
	</TabView>
	```
-->
<div
	bind:this={ref}
	role="tab"
	tabindex={disabled ? -1 : 0}
	data-value={value}
	aria-selected={active}
	aria-disabled={disabled || undefined}
	class={['fs-tab-view-tab', context.config.tabWidthMode, { active, disabled }, classes]}
	onclick={(e: MouseEvent) => invokeHandlers(e, disabled, [() => context.methods.setActiveTab(e, value), onclick])}
	onkeydown={(e: KeyboardEvent) => invokeHandlers(e, disabled, [onTabKeydown, onkeydown])}
	{...attributes}
>
	{#if icon}
		<span class="fs-tab-view-tab-icon">
			<RenderSoC SoC={icon} />
		</span>
	{/if}
	<span class="fs-tab-view-tab-label">{@render children?.()}</span>
	{#if _closable}
		<button
			type="button"
			class="fs-tab-view-tab-close"
			aria-label="Close tab"
			tabindex={-1}
			{disabled}
			onclick={(e: MouseEvent) => {
				// The tab underneath would otherwise read the click as "select me".
				e.stopPropagation();
				close(e);
			}}
		>
			<DismissRegular />
		</button>
	{/if}
	{#if active}
		<!--
			The inverted corners of the base. They are elements rather than the two pseudo-elements of
			the tab because each corner needs a box of its own to cast the fill and a second one to lay
			the stroke over it: a box never paints its own border over its own shadow.
		-->
		<span class="fs-tab-view-tab-foot start"></span>
		<span class="fs-tab-view-tab-foot end"></span>
	{/if}
</div>

<style>
	.fs-tab-view-tab {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-sizing: border-box;
		height: var(--fs-tab-view-tab-height, 2.25rem);
		padding: 0 0.5rem 0 0.75rem;
		border: 1px solid transparent;
		/* Only the top corners round: the bottom edge is where the tab meets what it opens. */
		border-radius: var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius) 0 0;
		background: transparent;
		color: var(--fs-text-secondary);
		font-size: var(--fs-body-font-size);
		line-height: var(--fs-body-line-height);
		cursor: pointer;
		user-select: none;
		outline: none;
		/* Pull the tab down by 1px to overlap the strip below it. */
		bottom: -1px;
		&:hover {
			background: var(--fs-subtle-fill-secondary);
			color: var(--fs-text-primary);
		}
		&:focus-visible {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: -0.125rem;
		}
		&.active {
			/* The selected tab is the page it opens, pulled up above the strip. */
			background: var(--fs-solid-background-quaternary);
			border-color: var(--fs-card-stroke-default);
			/* The base is where the tab meets what it opens, so nothing is drawn across it. */
			border-bottom: 1px solid var(--fs-solid-background-quaternary);
			color: var(--fs-text-primary);
			font-weight: 600;
			/* The feet reach over the neighbouring tabs, so the selected one paints above them. */
			z-index: 1;
			bottom: -2px;
		}
		/*
		 * The inverted corners a document tab has: instead of stopping square, each side curves out
		 * into the strip, which is what reads as one surface rather than a button sitting on top of
		 * one.
		 *
		 * The foot casts the fill. Its own shape — a box the size of the radius, rounded away from
		 * the tab — is the quarter disc the curve leaves behind, and a shadow is never painted under
		 * the shape casting it, so the spread lands exactly in the corner around the arc. The clip is
		 * what makes that usable: a shadow spreads in every direction, and without it the surface
		 * would bleed over the neighbouring tabs and below the base. A radius of spread reaches the
		 * far corner of the box, which is all it has to.
		 */
		& .fs-tab-view-tab-foot {
			position: absolute;
			bottom: 1px;
			width: var(--fs-tab-view-fillet, 0.4rem);
			height: var(--fs-tab-view-fillet, 0.4rem);
			box-shadow: 0 0 0 var(--fs-tab-view-fillet, 0.4rem) var(--fs-solid-background-quaternary);
			pointer-events: none;
			/*
			 * The stroke that carries the border of the tab around the curve, laid over the fill
			 * rather than beside it. A border cannot do that from the foot itself: an outer shadow
			 * starts where the border box ends, so the two never overlap and the translucent stroke
			 * would read against the strip instead of against the surface. A child paints after the
			 * shadow of its parent, and sitting 1px outside the foot puts its border on the first
			 * pixel of the fill — which leaves its inner edge exactly on the arc.
			 *
			 * Only the two sides the corner is rounded between are drawn, which is the arc and nothing
			 * else. The other two run the length of the foot outside the clip, and a clipped edge
			 * still leaves the sliver its antialiasing painted.
			 */
			&::after {
				content: '';
				position: absolute;
				inset: -1px;
				border: 0 solid var(--fs-card-stroke-default);
			}
			&.start {
				left: calc(-1 * var(--fs-tab-view-fillet, 0.4rem) - 1px);
				border-bottom-right-radius: var(--fs-tab-view-fillet, 0.4rem);
				clip-path: polygon(0% 20%, 120% 10%, 120% 132%, 10% 132%);
				&::after {
					border-width: 0 1px 1px 0;
					border-bottom-right-radius: calc(var(--fs-tab-view-fillet, 0.4rem) + 1px);
				}
			}
			&.end {
				right: calc(-1 * var(--fs-tab-view-fillet, 0.4rem) - 1px);
				border-bottom-left-radius: var(--fs-tab-view-fillet, 0.4rem);
				clip-path: polygon(-20% 10%, 90% 10%, 90% 132%, -20% 132%);
				&::after {
					border-width: 0 0 1px 1px;
					border-bottom-left-radius: calc(var(--fs-tab-view-fillet, 0.4rem) + 1px);
				}
			}
		}
		&.disabled {
			color: var(--fs-text-disabled);
			cursor: not-allowed;
			&:hover {
				background: transparent;
				color: var(--fs-text-disabled);
			}
			& .fs-tab-view-tab-close {
				cursor: not-allowed;
			}
		}
		/* Share the strip evenly, within the width a document tab is worth. */
		&.equal {
			flex: 1 1 0;
			min-width: 5rem;
			max-width: 12.5rem;
		}
		&.size-to-content {
			flex: 0 0 auto;
		}
		/* A resting tab shrinks to its icon, and only the selected one spells itself out. */
		&.compact:not(.active) {
			flex: 0 0 auto;
			padding: 0 0.5rem;
			& .fs-tab-view-tab-label,
			& .fs-tab-view-tab-close {
				display: none;
			}
		}
		& .fs-tab-view-tab-icon {
			display: flex;
			flex: 0 0 auto;
			align-items: center;
			justify-content: center;
			& :global(svg) {
				width: 1rem;
				height: 1rem;
			}
		}
		& .fs-tab-view-tab-label {
			flex: 1 1 auto;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			text-align: start;
		}
		& .fs-tab-view-tab-close {
			display: flex;
			flex: 0 0 auto;
			align-items: center;
			justify-content: center;
			width: 1.25rem;
			height: 1.25rem;
			padding: 0;
			border: none;
			border-radius: var(--fs-control-border-radius);
			background: transparent;
			color: inherit;
			cursor: pointer;
			&:hover:not(:disabled) {
				background: var(--fs-subtle-fill-secondary);
			}
			&:active:not(:disabled) {
				background: var(--fs-subtle-fill-tertiary);
			}
			& :global(svg) {
				width: 0.75rem;
				height: 0.75rem;
			}
		}
	}
	/* The hairline between two resting tabs is drawn by the strip: only it sees both of them. */
</style>
