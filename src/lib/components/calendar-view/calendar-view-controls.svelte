<script lang="ts">
	import { Button } from '$lib/index.js';
	import { CaretDownFilled, CaretUpFilled, DismissRegular } from 'fluentui-icons-svelte';
	import { getCalendarViewContext } from './calendar-view.svelte.js';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewControls must be used within a CalendarView');
	}

	let locale = $derived(CalendarContext.config.locale);

	let selectionMode = $derived(CalendarContext.config.selectionMode);

	let view = $derived(CalendarContext.state.view);

	let page = $derived(CalendarContext.state.page);

	let range = $derived(CalendarContext.state.range);

	let viewLabel = $derived.by(() => {
		let label = '';
		if (view === 'days') {
			label = new Intl.DateTimeFormat(locale, {
				year: 'numeric',
				month: 'long'
			}).format(page);
		} else if (view === 'months') {
			label = new Intl.DateTimeFormat(locale, {
				year: 'numeric'
			}).format(page);
		} else if (view === 'years') {
			const decadeStart = Math.floor(page.getFullYear() / 10) * 10;
			const decadeEnd = decadeStart + 9;

			label = new Intl.DateTimeFormat(locale, {
				year: 'numeric'
			}).formatRange(new Date(decadeStart, 0, 1), new Date(decadeEnd, 0, 1));
		}

		// In some locales, the first letter may not be capitalized
		return label.charAt(0).toUpperCase() + label.slice(1);
	});
</script>

<div class="fs-calendar-controls">
	<Button
		class="period-selector"
		disabled={view === 'years'}
		appearance="subtle"
		aria-label="Select month"
		aria-live="polite"
		onclick={(e) => CalendarContext.methods.updateView?.(e, view === 'days' ? 'months' : 'years')}
	>
		{viewLabel}
	</Button>
	<div class="navigation">
		<Button appearance="subtle" aria-label="Previous month" onclick={() => CalendarContext.methods.updatePage(-1)}>
			<CaretUpFilled width="16" />
		</Button>
		<Button appearance="subtle" aria-label="Next month" onclick={() => CalendarContext.methods.updatePage(1)}>
			<CaretDownFilled width="16" />
		</Button>
		<!--
			Only a range needs this. Clicking a selected day already takes it back in the
			other two modes, but a range has no such click: every click builds it further
			or starts it over.
		-->
		{#if selectionMode === 'range'}
			<Button
				appearance="subtle"
				aria-label="Clear the selected dates"
				disabled={!range.start && !range.end}
				onclick={(e) => CalendarContext.methods.clearSelection(e)}
			>
				<DismissRegular width="16" />
			</Button>
		{/if}
	</div>
</div>

<style>
	.fs-calendar-controls {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		border-bottom: 1px solid var(--fs-control-surface-stroke);
		width: 100%;
		gap: 0.5rem;
		border-bottom: 1px solid var(--fs-control-stroke-default);
		& > :global(.period-selector) {
			flex-grow: 1;
			justify-content: flex-start;
			font-weight: 500;
			font-size: var(--fs-body2-font-size);
			/* A third button on the right needs room, and this is where it comes from. */
			min-width: 0;
		}
		& .navigation {
			display: flex;
			gap: 0.5rem;
			position: relative;
			& > :global(.fs-button) {
				min-width: max-content;
				padding-inline: 0.5rem;
				& > :global(svg) {
					width: 16px;
					height: 16px;
					fill: var(--fs-control-strong-default);
				}
			}
		}
	}
</style>
