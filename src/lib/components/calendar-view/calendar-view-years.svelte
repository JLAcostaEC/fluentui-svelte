<script lang="ts">
	import { fly } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import CalendarViewItem from './calendar-view-item.svelte';
	import { compareDates, getCalendarViewContext, getCalendarYears, indexOfDate } from './calendar-view.svelte.js';
	import type { FocusIncrementAmount } from './types.js';
	import { tick } from 'svelte';
	import { getCSSDuration } from '$internal';
	import { SvelteDate } from 'svelte/reactivity';

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

	async function handleKeyDown(event: KeyboardEvent, date: Date) {
		if (!bodyElement) return;

		const { key } = event;

		if (
			key === 'ArrowUp' ||
			key === 'ArrowDown' ||
			key === 'ArrowLeft' ||
			key === 'ArrowRight' ||
			key === 'Home' ||
			key === 'End'
		) {
			event.preventDefault();
		}

		if (event.ctrlKey && key === 'ArrowDown') {
			updateView(event, 'months');
			return;
		}

		let focusOrder = bodyElement.querySelectorAll('button');
		let focusedDate = date;

		const focusIndex = Array.from(focusOrder).indexOf(<HTMLButtonElement>document.activeElement);

		if (focusOrder.length === 0) return;
		const focusIncrementAmount: FocusIncrementAmount = {
			ArrowUp: -4,
			ArrowDown: 4,
			ArrowLeft: -1,
			ArrowRight: 1
		};

		if (!focusIncrementAmount[key as keyof FocusIncrementAmount] || event.shiftKey) return;

		focusedDate = new Date(
			new SvelteDate(focusedDate).setFullYear(
				focusedDate.getFullYear() + focusIncrementAmount[key as keyof FocusIncrementAmount]
			)
		);

		let calendar = getCalendarYears(focusedDate);
		const newFocusedDate = calendar.find((day) => compareDates(day, focusedDate, 'year'));

		const aboveMinimumYears = minDate && newFocusedDate && minDate.getFullYear() > newFocusedDate.getFullYear();

		if (aboveMinimumYears || (maxDate && newFocusedDate && maxDate < newFocusedDate)) return;

		if (!compareDates(focusedDate, page, 'decade')) {
			if (key === 'ArrowLeft' || key === 'ArrowUp') {
				updatePage(-1, 'neutral');
			} else if (key === 'ArrowRight' || key === 'ArrowDown') {
				updatePage(1, 'neutral');
			}

			await tick();

			const newFocusedDate = calendar.find((day) => compareDates(day, focusedDate, 'year'));

			focusedDate = newFocusedDate ?? focusedDate;
			focusOrder = bodyElement.querySelectorAll('button');
			focusOrder?.[calendar.map(Number).indexOf(+(newFocusedDate || focusedDate))].focus();

			return;
		}

		focusOrder?.[focusIndex + focusIncrementAmount[key as keyof FocusIncrementAmount]].focus();
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
				{#each getCalendarYears(page).slice(row * 4, row * 4 + 4) as year, i (row * 4 + i)}
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
								onclick: (e: MouseEvent) => {
									selectYear(e, year);
								},
								onkeydown: (e: KeyboardEvent) => {
									handleKeyDown(e, year);
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
