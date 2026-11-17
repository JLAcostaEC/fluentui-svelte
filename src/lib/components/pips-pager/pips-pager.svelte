<script lang="ts">
	import { CaretGlyph } from '#internal';
	import type { PipsPagerProps } from './types.ts';

	let {
		index = $bindable(0),
		numberOfPages,
		maxVisiblePips = 5,
		orientation = 'horizontal',
		buttonVisibility = 'hidden',
		wrap = false,
		showNumbers = false,
		previousLabel = 'Previous page',
		nextLabel = 'Next page',
		formatPage = (page) => `Page ${page}`,
		onIndexChange,
		ref = $bindable(null),
		class: classes,
		...attributes
	}: PipsPagerProps = $props();

	const pips: HTMLButtonElement[] = [];
	const vertical = $derived(orientation === 'vertical');
	const last = $derived(numberOfPages - 1);

	/** Pip with keyboard focus; the window follows it, else the selected pip. */
	let focused: number | null = $state(null);
	/** Pip whose number is shown. */
	let hovered: number | null = $state(null);
	let flashed: number | null = $state(null);
	let flashTimer: ReturnType<typeof setTimeout> | undefined;

	const visible = $derived(Math.max(0, Math.min(numberOfPages, maxVisiblePips)));
	const start = $derived(Math.max(0, Math.min(numberOfPages - visible, (focused ?? index) - Math.floor(visible / 2))));
	const shown = $derived(showNumbers ? (hovered ?? focused ?? flashed) : null);

	const step = (from: number, delta: number) => {
		const next = from + delta;
		if (wrap) return (next + numberOfPages) % numberOfPages;
		return Math.max(0, Math.min(last, next));
	};

	const select = (target: number) => {
		if (target === index || target < 0 || target > last) return;
		index = target;
		onIndexChange?.(target);

		if (!showNumbers) return;
		clearTimeout(flashTimer);
		flashed = target;
		flashTimer = setTimeout(() => (flashed = null), 1000);
	};

	$effect(() => () => clearTimeout(flashTimer));

	// Arrow keys, Home and End move the focus; Enter and Space select.
	const onkeydown = (event: KeyboardEvent) => {
		if (focused === null) return;
		const rtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl';
		const keys: Record<string, number> = vertical
			? { ArrowUp: step(focused, -1), ArrowDown: step(focused, 1) }
			: { ArrowLeft: step(focused, rtl ? 1 : -1), ArrowRight: step(focused, rtl ? -1 : 1) };
		keys.Home = 0;
		keys.End = last;
		if (!(event.key in keys)) return;
		event.preventDefault();
		pips[keys[event.key]]?.focus();
	};
</script>

{#snippet navButton(direction: -1 | 1)}
	{@const atEdge = !wrap && (direction < 0 ? index <= 0 : index >= last)}
	<button
		type="button"
		class={['nav', direction < 0 ? 'previous' : 'next', (atEdge || numberOfPages < 2) && 'edge']}
		aria-label={direction < 0 ? previousLabel : nextLabel}
		onclick={() => select(step(index, direction))}
	>
		<CaretGlyph direction={vertical ? (direction < 0 ? 'up' : 'down') : direction < 0 ? 'left' : 'right'} />
	</button>
{/snippet}

<div
	{...attributes}
	bind:this={ref}
	class={['fs-pips-pager', orientation, `fs-pips-pager-buttons-${buttonVisibility}`, classes]}
	role={attributes.role ?? 'group'}
>
	{#if buttonVisibility !== 'hidden'}
		{@render navButton(-1)}
	{/if}

	<div class="window" style:--fs-pips-visible={visible}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="track" style:--fs-pips-start={start} {onkeydown}>
			{#each { length: numberOfPages }, i (i)}
				<button
					type="button"
					class={['pip', i === index && 'selected', i === shown && 'numbered']}
					tabindex={i === (focused ?? index) ? 0 : -1}
					aria-label={formatPage(i + 1)}
					aria-current={i === index ? 'page' : undefined}
					bind:this={pips[i]}
					onclick={() => select(i)}
					onfocus={() => (focused = i)}
					onblur={() => (focused = null)}
					onpointerenter={() => (hovered = i)}
					onpointerleave={() => (hovered = null)}
				>
					{#if i === shown}
						<span class="number" aria-hidden="true">{i + 1}</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	{#if buttonVisibility !== 'hidden'}
		{@render navButton(1)}
	{/if}
</div>

<style>
	.fs-pips-pager {
		--fs-pips-size: 12px;
		display: inline-flex;
		align-items: center;
		color: var(--fs-control-strong-default);

		& .window {
			overflow: clip;
			inline-size: calc(var(--fs-pips-visible) * var(--fs-pips-size));
		}

		& .track {
			display: flex;
			margin-inline-start: calc(var(--fs-pips-start) * var(--fs-pips-size) * -1);
			transition: margin 0.167s ease-out;
			@media (prefers-reduced-motion: reduce) {
				transition: none;
			}
		}

		& button {
			display: flex;
			flex: none;
			align-items: center;
			justify-content: center;
			margin: 0;
			padding: 0;
			border: none;
			border-radius: var(--fs-control-border-radius);
			background: none;
			color: inherit;
			cursor: default;
			outline: none;
			&:focus-visible {
				outline: 2px solid var(--fs-focus-stroke-outer);
				outline-offset: -2px;
			}
		}

		& .pip {
			inline-size: var(--fs-pips-size);
			block-size: 24px;
			&::before {
				content: '';
				inline-size: 4px;
				block-size: 4px;
				border-radius: 50%;
				background: currentColor;
				transition: scale 0.083s;
			}
			&:hover {
				color: var(--fs-text-secondary);
			}
			&.selected,
			&:hover {
				&::before {
					scale: 1.5;
				}
			}
			&:active:not(.selected)::before {
				scale: 1;
			}

			/* With showNumbers, the page number takes the place of the dot. */
			&.numbered::before {
				display: none;
			}
			& .number {
				font-size: var(--fs-caption2-font-size);
				line-height: 1;
				font-variant-numeric: tabular-nums;
				animation: fs-pips-number 0.083s ease-out;
				@media (prefers-reduced-motion: reduce) {
					animation: none;
				}
			}
			&.selected .number {
				font-weight: 600;
			}
		}

		& .nav {
			inline-size: 24px;
			block-size: 24px;
			&:hover,
			&:active {
				color: var(--fs-text-secondary);
			}
			&:active :global(svg) {
				scale: 0.875;
			}
			&.edge {
				visibility: hidden;
			}
		}

		&.fs-pips-pager-buttons-hover:not(:hover, :focus-within) .nav {
			opacity: 0;
		}

		&.horizontal:dir(rtl) .nav :global(svg) {
			scale: -1 1;
		}

		&.vertical {
			flex-direction: column;

			& .window {
				inline-size: auto;
				block-size: calc(var(--fs-pips-visible) * var(--fs-pips-size));
			}
			& .track {
				flex-direction: column;
				margin-inline-start: 0;
				margin-block-start: calc(var(--fs-pips-start) * var(--fs-pips-size) * -1);
			}
			& .pip {
				inline-size: 24px;
				block-size: var(--fs-pips-size);
			}
		}
	}

	@keyframes fs-pips-number {
		from {
			opacity: 0;
		}
	}
</style>
