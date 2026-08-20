<script lang="ts">
	import { fly } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import CalendarViewItem from './calendar-view-item.svelte';
	import { compareDates, getCalendarViewContext, getCalendarYears, indexOfDate } from './calendar-view.svelte.js';
	import { createCalendarNavigation, YEAR_GRID } from './calendar-view-grid.js';
	import { getGlobalFSContext } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { getCSSDuration } from '$internal';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewYears must be used within a CalendarView');
	}

	const { selectYear, updatePage } = CalendarContext.methods;

	let { locale, minDate, maxDate, multiple } = CalendarContext.config;

	let { value, page, pageAnimationDirection } = $derived(CalendarContext.state);

	let calendarYears = $derived(getCalendarYears(page));

	let bodyElement: HTMLElement | null = $state(null);

	let pageAnimationDuration = $derived(getCSSDuration ? getCSSDuration('--fs-normal-duration') : 333);

	const getFirstFocusableYear = () =>
		calendarYears.find(
			(d) =>
				compareDates(d, page, 'decade') &&
				(!minDate || minDate.getFullYear() <= d.getFullYear()) &&
				(!maxDate || maxDate >= d)
		);

	const isDisabled = (year: Date) => {
		return (minDate && minDate.getFullYear() > year.getFullYear()) || (maxDate && maxDate < year);
	};

	const isSelected = (year: Date) => {
		return (
			value !== null &&
			(Array.isArray(value) ? indexOfDate(value, year, 'year') > -1 : compareDates(value, year, 'year'))
		);
	};

	/** The decade the grid is showing, e.g. "2020 – 2029". */
	let pageLabel = $derived.by(() => {
		const start = Math.floor(page.getFullYear() / 10) * 10;

		return new Intl.DateTimeFormat(locale, { year: 'numeric' }).formatRange(
			new Date(start, 0, 1),
			new Date(start + 9, 0, 1)
		);
	});

	const yearLabel = (year: Date) => new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(year);

	const globalContext = getGlobalFSContext();

	const navigate = createCalendarNavigation({
		grid: YEAR_GRID,
		body: () => bodyElement,
		page: () => page,
		disabled: (year) => !!isDisabled(year),
		blackout: () => false,
		updatePage
	});

	// Tabspot reports what it cannot decide — running out of cells, or landing on a
	// year this page does not own — and the calendar answers by turning the page.
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
		aria-multiselectable={multiple || undefined}
		in:fly={{
			opacity: 1,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : 0,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? -155 : 155
		}}
		out:fly={{
			opacity: 0.5,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : 0,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? 155 : -155
		}}
	>
		{#each Array(4) as _, row (row)}
			<div class="fs-calendar-view-row" role="row">
				{#each calendarYears.slice(row * 4, row * 4 + 4) as year, i (row * 4 + i)}
					{@const selected = isSelected(year)}
					{@const inDecade = compareDates(year, page, 'decade')}
					{@const firstFocusableYear = getFirstFocusableYear()}
					{@const disabled = isDisabled(year)}

					<CalendarViewItem
						{disabled}
						{selected}
						variant="monthYear"
						outOfRange={!inDecade}
						current={compareDates(year, new Date(), 'year')}
						buttonAttributes={{
							tabindex: firstFocusableYear && compareDates(firstFocusableYear, year, 'year') ? 0 : -1,
							'aria-label': yearLabel(year),
							'data-date': year.getTime(),
							onclick: (e: MouseEvent) => {
								selectYear(e, year);
							}
						}}
					>
						{year.getFullYear()}
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
