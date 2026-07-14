<script lang="ts">
	import { fly } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import {
		compareDates,
		getCalendarDays,
		getCalendarViewContext,
		getMonthLocale,
		indexOfDate
	} from './calendar-view.svelte.js';
	import CalendarViewItem from './calendar-view-item.svelte';
	import type { FocusIncrementAmount } from './types.js';
	import { tick } from 'svelte';
	import { getCSSDuration } from '$internal';
	import { SvelteDate } from 'svelte/reactivity';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewDays must be used within a CalendarView');
	}

	const { selectDay, updateView, updatePage } = CalendarContext.methods;

	let { value, page, pageAnimationDirection } = $derived(CalendarContext.state);

	let { locale, minDate, weekStart, blackoutDates, headers, maxDate } = $derived(CalendarContext.config);

	let calendarDays = $derived(getCalendarDays(page, weekStart));

	let bodyElement: HTMLElement | null = $state(null);

	let pageAnimationDuration: number = $derived(getCSSDuration ? getCSSDuration('--fs-normal-duration') : 333);

	const isSelected = (day: Date) => {
		return value && (Array.isArray(value) ? indexOfDate(value, day, 'day') > -1 : compareDates(value, day, 'day'));
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
				updateView(event, 'months');
				return;
			}
		}

		let focusOrder = bodyElement.querySelectorAll('button');
		let focusedDate = date;

		const focusIndex = Array.from(focusOrder).indexOf(<HTMLButtonElement>document.activeElement);

		if (focusOrder.length === 0) return;

		let focusIncrementAmount: FocusIncrementAmount = {
			ArrowUp: -7,
			ArrowDown: 7,
			ArrowLeft: -1,
			ArrowRight: 1
		};

		if (!focusIncrementAmount[key as keyof FocusIncrementAmount] || event.shiftKey) return;

		focusedDate = new SvelteDate(
			new SvelteDate(focusedDate).setDate(
				focusedDate.getDate() + focusIncrementAmount[key as keyof FocusIncrementAmount]
			)
		);

		const nextDateIsBlackout = blackoutDates && indexOfDate(blackoutDates, focusedDate, 'day') > -1;

		if (nextDateIsBlackout) {
			focusedDate.setDate(focusedDate.getDate() + focusIncrementAmount[key as keyof FocusIncrementAmount]);
		}

		let newFocusedDate = calendarDays.find((day) => compareDates(day, focusedDate, 'time'));

		if (newFocusedDate && ((minDate && minDate > newFocusedDate) || (maxDate && maxDate < newFocusedDate))) return;

		if (focusedDate.getMonth() !== page.getMonth()) {
			if (key === 'ArrowLeft' || key === 'ArrowUp') {
				updatePage(-1, 'neutral');
			} else if (key === 'ArrowRight' || key === 'ArrowDown') {
				updatePage(1, 'neutral');
			}

			await tick();

			newFocusedDate ??= calendarDays.find((day) => compareDates(day, focusedDate, 'time'));
			focusOrder = bodyElement.querySelectorAll('button');
			focusOrder?.[calendarDays.map(Number).indexOf(+(newFocusedDate || focusedDate))].focus();

			return;
		}

		focusOrder?.[
			focusIndex + focusIncrementAmount[key as keyof FocusIncrementAmount] * (nextDateIsBlackout ? 2 : 1)
		].focus();
	}

	$effect.pre(() => {
		pageAnimationDuration = getCSSDuration('--fs-normal-duration') || 333;
	});
</script>

{#key page}
	<tbody
		bind:this={bodyElement}
		class="fs-calendar-view-days"
		in:fly={{
			opacity: 1,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : 0,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? -215 : 215
		}}
		out:fly={{
			opacity: 0,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration : 0,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? 215 : -215
		}}
	>
		{#each Array(6) as _, week (week)}
			<tr class="fs-calendar-view-week">
				{#each calendarDays.slice(week * 7, week * 7 + 7) as day, i (week * 7 + i)}
					{@const selected = isSelected(day)}
					{@const inMonth = compareDates(day, page, 'month')}
					{@const header =
						(headers && day.getDate() === 1 && getMonthLocale(day.getMonth(), { locale, format: 'short' })) || ''}
					<CalendarViewItem
						{header}
						{selected}
						outOfRange={!inMonth}
						current={compareDates(day, new Date(), 'day')}
						disabled={(minDate && minDate > day) || (maxDate && maxDate < day)}
						blackout={blackoutDates && indexOfDate(blackoutDates, day, 'day') > -1}
						buttonAttributes={{
							tabindex: inMonth ? 0 : -1,
							onclick: (e: MouseEvent) => {
								selectDay(e, day);
							},
							onkeydown: (e: KeyboardEvent) => handleKeyDown(e, day)
						}}
					>
						{day.getDate()}
					</CalendarViewItem>
				{/each}
			</tr>
		{/each}
	</tbody>
{/key}

<style>
	.fs-calendar-view-days {
		display: flex;
		flex-direction: column;
		inline-size: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		padding: 0.5rem;
		& .fs-calendar-view-week {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			grid-auto-rows: 1fr;
		}
	}
</style>
