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
	import { getGlobalFSContext, getReducedMotion } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';

	import { createCalendarNavigation, DAY_GRID } from './calendar-view-grid.js';
	import { getCSSDuration } from '$internal';

	const CalendarContext = getCalendarViewContext();

	if (!CalendarContext) {
		throw new Error('CalendarViewDays must be used within a CalendarView');
	}

	const { selectDay, updatePage } = CalendarContext.methods;

	let reducedMotion = getReducedMotion();

	let { value, page, pageAnimationDirection } = $derived(CalendarContext.state);

	let { locale, minDate, weekStart, blackoutDates, headers, maxDate } = $derived(CalendarContext.config);

	let calendarDays = $derived(getCalendarDays(page, weekStart));

	let bodyElement: HTMLElement | null = $state(null);

	let pageAnimationDuration: number = $derived(reducedMotion() ? 0 : getCSSDuration('--fs-normal-duration') || 333);

	const isSelected = (day: Date) => {
		return value && (Array.isArray(value) ? indexOfDate(value, day, 'day') > -1 : compareDates(value, day, 'day'));
	};

	const isDisabled = (day: Date) => (minDate && minDate > day) || (maxDate && maxDate < day);

	const isBlackout = (day: Date) => !!blackoutDates && indexOfDate(blackoutDates, day, 'day') > -1;

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
		const root = bodyElement?.closest('table');
		const instance = globalContext?.state.tabspotInstance;

		if (!root || !instance) return;

		return instance.subscribe(root, navigate);
	});
</script>

{#key page}
	<tbody
		bind:this={bodyElement}
		class="fs-calendar-view-days"
		in:fly={{
			opacity: 1,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration: pageAnimationDuration,
			easing: circOut,
			y: pageAnimationDirection === 'neutral' ? 0 : pageAnimationDirection === 'up' ? -215 : 215
		}}
		out:fly={{
			opacity: 0,
			duration: pageAnimationDirection !== 'neutral' ? pageAnimationDuration: pageAnimationDuration,
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
						disabled={isDisabled(day)}
						blackout={isBlackout(day)}
						buttonAttributes={{
							tabindex: inMonth ? 0 : -1,
							'data-date': day.getTime(),
							onclick: (e: MouseEvent) => {
								selectDay(e, day);
							}
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
