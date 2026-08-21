<script lang="ts">
	import { fly } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import {
		compareDates,
		getCalendarDays,
		getCalendarViewContext,
		getMonthLocale,
		hasBlackoutBetween,
		indexOfDate,
		rangePositionOf,
		startOfDay
	} from './calendar-view.svelte.js';
	import CalendarViewItem from './calendar-view-item.svelte';
	import { getGlobalFSContext, getReducedMotion } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';

	import { cellDate, createCalendarNavigation, DAY_GRID } from './calendar-view-grid.js';
	import { getCSSDuration } from '$internal';
	import { on } from 'svelte/events';
	import type { CalendarDateRange } from './types.js';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewDays must be used within a CalendarView');
	}

	const { selectDay, updatePage } = CalendarContext.methods;

	let reducedMotion = getReducedMotion();

	let { value, range, page, pageAnimationDirection } = $derived(CalendarContext.state);

	let { locale, minDate, weekStart, blackoutDates, headers, maxDate, selectionMode, blackoutBreaksRange } = $derived(
		CalendarContext.config
	);

	let calendarDays = $derived(getCalendarDays(page, weekStart));

	let bodyElement: HTMLElement | null = $state(null);

	let pageAnimationDuration: number = $derived(reducedMotion() ? 0 : getCSSDuration('--fs-normal-duration') || 333);

	// The day the pointer or the keyboard is offering as the end of a half-built range.
	// Two signals rather than one: leaving with the pointer must not wipe out the
	// preview a focused cell is still holding.
	let hoveredDay: Date | null = $state(null);

	let focusedDay: Date | null = $state(null);

	/**
	 * The range to paint: the one that is committed, or the one the user is pointing at.
	 *
	 * Nothing is painted for a backwards preview or for a span this configuration will
	 * not accept — the absence of a band is how the grid says "that click will start over".
	 */
	let bandRange = $derived.by<CalendarDateRange | null>(() => {
		if (selectionMode !== 'range' || !range.start) return null;

		const end = range.end ?? hoveredDay ?? focusedDay;

		if (!end || startOfDay(end) < startOfDay(range.start)) return null;
		if (blackoutBreaksRange && hasBlackoutBetween(range.start, end, blackoutDates)) return null;

		return { start: range.start, end };
	});

	const isSelected = (day: Date) => {
		if (selectionMode === 'range') {
			return (
				(!!range.start && compareDates(range.start, day, 'day')) || (!!range.end && compareDates(range.end, day, 'day'))
			);
		}

		return value && (Array.isArray(value) ? indexOfDate(value, day, 'day') > -1 : compareDates(value, day, 'day'));
	};

	const isDisabled = (day: Date) => (minDate && minDate > day) || (maxDate && maxDate < day);

	const isBlackout = (day: Date) => !!blackoutDates && indexOfDate(blackoutDates, day, 'day') > -1;

	/** What the grid as a whole is showing. */
	let pageLabel = $derived(new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(page));

	/** "Thursday, 15 January 2026" — the weekday is why the header row can stay decorative. */
	const dayLabel = (day: Date) => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(day);

	/**
	 * Follows the day the user is offering as the end of the range.
	 *
	 * Delegated on the grid rather than bound per cell: `pointerover` and `focusin`
	 * both bubble, so six weeks of days cost four listeners instead of a hundred and
	 * sixty-eight. The day is resolved from the whole cell rather than from the button,
	 * because the button is a circle and the corners of its cell are not inside it —
	 * reading only the button would blink the band off as the pointer crossed them.
	 */
	function rangePreview(node: HTMLElement) {
		if (selectionMode !== 'range') return;

		const dayUnder = (target: EventTarget | null) => {
			const button = (target as Element)?.closest?.('[role="gridcell"]')?.querySelector('button');

			return button && !button.disabled ? cellDate(button) : null;
		};

		const off = [
			on(node, 'pointerover', (event) => (hoveredDay = dayUnder(event.target))),
			on(node, 'pointerleave', () => (hoveredDay = null)),
			on(node, 'focusin', (event) => (focusedDay = dayUnder(event.target))),
			on(node, 'focusout', (event) => {
				if (!node.contains(event.relatedTarget as Node)) focusedDay = null;
			})
		];

		return () => off.forEach((unsubscribe) => unsubscribe());
	}

	const globalContext = getGlobalFSContext();

	const navigate = createCalendarNavigation({
		grid: DAY_GRID,
		body: () => bodyElement,
		page: () => page,
		disabled: (day) => !!isDisabled(day),
		blackout: isBlackout,
		updatePage
	});

	// Tabspot reports what it cannot decide — running out of cells, or landing on a
	// date this page does not own — and the calendar answers by turning the page.
	$effect(() => {
		const root = bodyElement?.closest<HTMLElement>('[data-calendar-grid]');
		const instance = globalContext?.state.tabspotInstance;

		if (!root || !instance) return;

		return instance.subscribe(root, navigate);
	});
</script>

{#key page}
	<div
		bind:this={bodyElement}
		class="fs-calendar-view-days"
		data-calendar-page
		role="grid"
		aria-label={pageLabel}
		aria-multiselectable={selectionMode !== 'single' || undefined}
		{@attach rangePreview}
		in:fly={{
			opacity: 1,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : pageAnimationDuration,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? -215 : 215
		}}
		out:fly={{
			opacity: 0,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : pageAnimationDuration,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? 215 : -215
		}}
	>
		{#each Array(6) as _, week (week)}
			<div class="fs-calendar-view-week" role="row">
				{#each calendarDays.slice(week * 7, week * 7 + 7) as day, i (week * 7 + i)}
					{@const selected = isSelected(day)}
					{@const inMonth = compareDates(day, page, 'month')}
					{@const header =
						(headers && day.getDate() === 1 && getMonthLocale(day.getMonth(), { locale, format: 'short' })) || ''}
					<CalendarViewItem
						{header}
						{selected}
						rangePosition={bandRange ? rangePositionOf(day, bandRange) : undefined}
						outOfRange={!inMonth}
						current={compareDates(day, new Date(), 'day')}
						disabled={isDisabled(day)}
						blackout={isBlackout(day)}
						buttonAttributes={{
							tabindex: inMonth ? 0 : -1,
							'aria-label': dayLabel(day),
							'data-date': day.getTime(),
							onclick: (e: MouseEvent) => {
								selectDay(e, day);
							}
						}}
					>
						{day.getDate()}
					</CalendarViewItem>
				{/each}
			</div>
		{/each}
	</div>
{/key}

<style>
	.fs-calendar-view-days {
		display: flex;
		flex-direction: column;
		inline-size: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		padding-bottom: 0.5rem;
		& .fs-calendar-view-week {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			grid-auto-rows: 1fr;
		}
	}
</style>
