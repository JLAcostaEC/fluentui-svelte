<script lang="ts">
	import { fly } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import CalendarViewItem from './calendar-view-item.svelte';
	import { compareDates, getCalendarViewContext, getCalendarYears, indexOfDate } from './calendar-view.svelte.js';
	import { createCalendarKeyboard, YEAR_GRID } from './calendar-view-grid.js';
	import { getCSSDuration } from '$internal';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewYears must be used within a CalendarView');
	}

	const { selectYear, updatePage, updateView } = CalendarContext.methods;

	let { minDate, maxDate } = CalendarContext.config;

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

	const navigate = createCalendarKeyboard({
		grid: YEAR_GRID,
		body: () => bodyElement,
		page: () => page,
		disabled: (year) => !!isDisabled(year),
		blackout: () => false,
		updatePage
	});

	function handleKeyDown(event: KeyboardEvent, year: Date, index: number) {
		if (event.ctrlKey && event.key === 'ArrowDown') {
			updateView(event, 'months', year);
			return;
		}

		navigate(event, year, index);
	}
</script>

{#key page}
	<tbody
		bind:this={bodyElement}
		class="fs-calendar-view-months"
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
			<tr class="fs-calendar-view-row">
				{#each calendarYears.slice(row * 4, row * 4 + 4) as year, i (row * 4 + i)}
					{@const index = row * 4 + i}
					{@const selected = isSelected(year)}
					{@const inDecade = compareDates(year, page, 'decade')}
					{@const firstFocusableYear = getFirstFocusableYear()}
					{@const disabled = isDisabled(year)}

					<td role="gridcell">
						<CalendarViewItem
							{disabled}
							{selected}
							variant="monthYear"
							outOfRange={!inDecade}
							current={compareDates(year, new Date(), 'year')}
							buttonAttributes={{
								tabindex: firstFocusableYear && compareDates(firstFocusableYear, year, 'year') ? 0 : -1,
								'data-date': year.getTime(),
								onclick: (e: MouseEvent) => {
									selectYear(e, year);
								},
								onkeydown: (e: KeyboardEvent) => {
									handleKeyDown(e, year, index);
								}
							}}
						>
							{year.getFullYear()}
						</CalendarViewItem>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
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
