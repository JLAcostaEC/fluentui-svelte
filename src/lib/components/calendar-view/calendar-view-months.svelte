<script lang="ts">
	import { fly } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import CalendarViewItem from './calendar-view-item.svelte';
	import {
		compareDates,
		getCalendarMonths,
		getCalendarViewContext,
		getMonthLocale,
		indexOfDate,
		rangeCovers
	} from './calendar-view.svelte.js';
	import { createCalendarNavigation, MONTH_GRID } from './calendar-view-grid.js';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { getCSSDuration } from '$internal';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewMonths must be used within a CalendarView');
	}

	const { selectMonth, updatePage } = CalendarContext.methods;

	let { locale, minDate, headers, maxDate, selectionMode } = CalendarContext.config;

	let { value, range, page, pageAnimationDirection } = $derived(CalendarContext.state);

	let calendarMonths = $derived(getCalendarMonths(page));

	let bodyElement: HTMLElement | null = $state(null);

	let pageAnimationDuration: number = $derived(getCSSDuration ? getCSSDuration('--fs-normal-duration') : 333);

	const getFirstFocusableMonth = () =>
		calendarMonths.find(
			(d) =>
				compareDates(d, page, 'year') &&
				(!minDate ||
					new Date(minDate.getFullYear(), minDate.getMonth(), 1) <= new Date(d.getFullYear(), d.getMonth(), 1)) &&
				(!maxDate || maxDate >= d)
		);

	const isDisabled = (month: Date) => {
		return (
			(minDate && minDate.getMonth() > month.getMonth() && minDate.getFullYear() === month.getFullYear()) ||
			(maxDate && maxDate < month)
		);
	};

	const isSelected = (month: Date) => {
		// A month the range merely passes through counts as selected: it is one cell
		// standing for the whole month, and the band belongs to the day view.
		if (selectionMode === 'range') return rangeCovers(month, range, 'month');

		return (
			value !== null &&
			(Array.isArray(value) ? indexOfDate(value, month, 'month') > -1 : compareDates(value, month, 'month'))
		);
	};

	/** What the grid as a whole is showing. */
	let pageLabel = $derived(new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(page));

	/** "January 2026" rather than a bare "Jan". */
	const monthLabel = (month: Date) => new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(month);

	const globalContext = getGlobalFSContext();

	const navigate = createCalendarNavigation({
		grid: MONTH_GRID,
		body: () => bodyElement,
		page: () => page,
		disabled: (month) => !!isDisabled(month),
		blackout: () => false,
		updatePage
	});

	// Tabspot reports what it cannot decide — running out of cells, or landing on a
	// month this page does not own — and the calendar answers by turning the page.
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
		class="fs-calendar-view-months"
		data-calendar-page
		role="grid"
		aria-label={pageLabel}
		aria-multiselectable={selectionMode !== 'single' || undefined}
		in:fly={{
			opacity: 1,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : 0,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? -295 : 295
		}}
		out:fly={{
			opacity: 0.5,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : 0,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? 295 : -295
		}}
	>
		{#each Array(4) as _, row (row)}
			<div class="fs-calendar-view-row" role="row">
				{#each calendarMonths.slice(row * 4, row * 4 + 4) as month, i (row * 4 + i)}
					{@const selected = isSelected(month)}
					{@const inYear = month.getFullYear() === page.getFullYear()}
					{@const firstFocusableMonth = getFirstFocusableMonth()}
					{@const disabled = isDisabled(month)}
					{@const header = (headers && month.getMonth() === 0 && month.getFullYear().toString()) || ''}

					<CalendarViewItem
						{disabled}
						{header}
						{selected}
						variant="monthYear"
						outOfRange={!inYear}
						current={compareDates(month, new Date(), 'month')}
						buttonAttributes={{
							tabindex: firstFocusableMonth && compareDates(firstFocusableMonth, month, 'month') ? 0 : -1,
							'aria-label': monthLabel(month),
							'data-date': month.getTime(),
							onclick: (e: MouseEvent) => {
								selectMonth(e, month);
							}
						}}
					>
						{getMonthLocale(month.getMonth(), {
							locale,
							format: 'short'
						})}
					</CalendarViewItem>
				{/each}
			</div>
		{/each}
	</div>
{/key}

<style>
	.fs-calendar-view-months {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		inline-size: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		padding: 0.5rem;
		& .fs-calendar-view-row {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-auto-rows: 1fr;
			grid-gap: 0.5rem;
		}
	}
</style>
