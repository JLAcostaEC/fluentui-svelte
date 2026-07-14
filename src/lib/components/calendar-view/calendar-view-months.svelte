<script lang="ts">
	import { fly } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import CalendarViewItem from './calendar-view-item.svelte';
	import {
		compareDates,
		getCalendarMonths,
		getCalendarViewContext,
		getMonthLocale,
		indexOfDate
	} from './calendar-view.svelte.js';
	import type { FocusIncrementAmount } from './types.js';
	import { tick } from 'svelte';
	import { getCSSDuration } from '$internal';
	import { SvelteDate } from 'svelte/reactivity';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewMonths must be used within a CalendarView');
	}

	const { selectMonth, updateView, updatePage } = CalendarContext.methods;

	let { locale, minDate, headers, maxDate } = CalendarContext.config;

	let { value, page, pageAnimationDirection } = $derived(CalendarContext.state);

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
		return (
			value !== null &&
			(Array.isArray(value) ? indexOfDate(value, month, 'month') > -1 : compareDates(value, month, 'month'))
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

		if (event.ctrlKey && (key === 'ArrowUp' || key === 'ArrowDown')) {
			if (key === 'ArrowUp') {
				updateView(event, 'years');
				return;
			}
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
			new SvelteDate(focusedDate).setMonth(
				focusedDate.getMonth() + focusIncrementAmount[key as keyof FocusIncrementAmount],
				1
			)
		);

		let calendar = getCalendarMonths(focusedDate);
		const newFocusedDate = calendar.find((day) => compareDates(day, focusedDate, 'month'));

		const aboveMinimumMonths =
			minDate &&
			newFocusedDate &&
			minDate.getMonth() > newFocusedDate.getMonth() &&
			minDate.getFullYear() === newFocusedDate.getFullYear();

		if (aboveMinimumMonths || (maxDate && newFocusedDate && maxDate < newFocusedDate)) return;

		if (!compareDates(focusedDate, page, 'year')) {
			if (key === 'ArrowLeft' || key === 'ArrowUp') {
				updatePage(-1, 'neutral');
			} else if (key === 'ArrowRight' || key === 'ArrowDown') {
				updatePage(1, 'neutral');
			}

			await tick();

			const newFocusedDate = calendar.find((day) => compareDates(day, focusedDate, 'month'));

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
			<tr class="fs-calendar-view-row">
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
							onclick: (e: MouseEvent) => {
								selectMonth(e, month);
							},
							onkeydown: (e: KeyboardEvent) => {
								handleKeyDown(e, month);

								if (e.key === 'Enter' || e.key === ' ') {
									updateView(e, 'days');
								}
							}
						}}
					>
						{getMonthLocale(month.getMonth(), {
							locale,
							format: 'short'
						})}
					</CalendarViewItem>
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
