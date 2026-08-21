<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { setTabspotAttributes } from 'tabspot';
	import { onMount } from 'svelte';
	import { circOut } from 'svelte/easing';
	import { Flyout } from '$lib/index.js';
	import CalendarViewDays from './calendar-view-days.svelte';
	import CalendarViewYears from './calendar-view-years.svelte';
	import CalendarViewMonths from './calendar-view-months.svelte';
	import CalendarViewHeader from './calendar-view-header.svelte';
	import CalendarViewControls from './calendar-view-controls.svelte';
	import {
		defineState,
		defineProperty,
		floating as _floating,
		getCSSDuration,
		flyToOffset,
		getOffset,
		fadeScale,
		reactiveBoundingRect
	} from '$internal';
	import {
		compareDates,
		getPageByOffset,
		hasBlackoutBetween,
		indexOfDate,
		rangeLength,
		setCalendarViewContext,
		startOfDay
	} from './calendar-view.svelte.js';
	import { CALENDAR_GRID_CONFIG, VIEW_PRECISION, cellDate, focusCalendarView } from './calendar-view-grid.js';
	import { on } from 'svelte/events';
	import { getReducedMotion } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import type {
		AnimationDirection,
		CalendarViewProps,
		CalendarViewState,
		DateComparisonPrecision,
		View
	} from './types.js';

	let {
		ref = $bindable(),
		value = $bindable(null),
		range = $bindable({ start: null, end: null }),
		view = 'days',
		selectionMode = 'single',
		blackoutBreaksRange,
		minDate,
		maxDate,
		locale = 'en-US',
		weekStart = 1,
		blackoutDates,
		headers,
		floating,
		onChange,
		onRangeChange,
		onViewChange,
		...attributes
	}: CalendarViewProps = $props();

	const reducedMotion = getReducedMotion();

	let viewAnimationDirection = $state('neutral');

	let pageAnimationDirection = $state('neutral');

	let pageAnimationDuration = $state(333);

	let firstValue = $derived(Array.isArray(value) ? value[0] : (value ?? new Date()));

	// svelte-ignore state_referenced_locally
	let page = $state(
		(!minDate || firstValue >= minDate) && (!maxDate || firstValue < maxDate)
			? new Date(firstValue.getFullYear(), firstValue.getMonth(), 1)
			: firstValue < minDate!
				? new Date(minDate!.getFullYear(), minDate!.getMonth(), 1)
				: new Date(maxDate!.getFullYear(), maxDate!.getMonth(), 1)
	);

	let boundingElement = reactiveBoundingRect();

	let gridElement: HTMLElement | undefined = $state();

	// Set when a view change starts from a grid cell, so the new grid can pick focus
	// up where the old one left it. A change started from the header leaves it null:
	// focus belongs to the button that is still there.
	let pendingFocus: { date: Date; precision: DateComparisonPrecision } | null = null;

	// live region is only announced when its text changes.
	let liveMessage = $state('');

	let dayFormat = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'long' }));

	let dayRangeFormat = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }));

	function updatePage(amount: number = 0, directionOverride: AnimationDirection | undefined = undefined) {
		page = getPageByOffset(amount, page, view);
		if (directionOverride) {
			pageAnimationDirection = directionOverride;
			return;
		}
		if (amount <= -1) {
			pageAnimationDirection = 'up';
		} else if (amount >= 1) {
			pageAnimationDirection = 'down';
		} else {
			pageAnimationDirection = 'neutral';
		}
	}

	function updateView(e: Event, newView: View, focusDate?: Date) {
		if ((view === 'days' && newView === 'months') || (view === 'months' && newView === 'years')) {
			viewAnimationDirection = 'up';
		} else if ((view === 'years' && newView === 'months') || (view === 'months' && newView === 'days')) {
			viewAnimationDirection = 'down';
		} else {
			viewAnimationDirection = 'neutral';
		}

		pendingFocus = focusDate ? { date: focusDate, precision: VIEW_PRECISION[newView] } : null;
		pageAnimationDirection = 'neutral';
		view = newView;
		updatePage();
		onViewChange?.(e, newView);
	}

	function selectDay(e: Event, day: Date) {
		if (selectionMode === 'range') {
			selectRangeDay(e, day);
			return;
		}

		if (selectionMode === 'multiple') {
			const days = Array.isArray(value) ? value : value ? [value] : [];
			const index = indexOfDate(days, day);

			value = index === -1 ? [...days, day] : days.filter((_, i) => i !== index);
		} else {
			const single = Array.isArray(value) ? null : value;

			value = single && compareDates(single, day) ? null : day;
		}

		onChange?.(e, value);
	}

	/**
	 * One click of a range.
	 *
	 * The range is only ever built forwards: a click before the start, or one that
	 * lands on a finished range, opens a new range on that day rather than stretching
	 * or inverting the current one. Clicking the start again closes a range of a
	 * single day
	 */
	function selectRangeDay(e: Event, day: Date) {
		const start = range.start;
		const restart =
			!start ||
			range.end !== null ||
			startOfDay(day) < startOfDay(start) ||
			// The consumer asked for ranges that claim every day they span, so a
			// blocked day in the way makes this click a new start instead of an end.
			(!!blackoutBreaksRange && hasBlackoutBetween(start, day, blackoutDates));

		range = restart ? { start: day, end: null } : { start, end: day };

		if (range.end) {
			const days = rangeLength(range);
			liveMessage = `${dayRangeFormat.formatRange(range.start!, range.end)} selected, ${days} ${days === 1 ? 'day' : 'days'}.`;
		} else {
			liveMessage = `${dayFormat.format(day)} selected as the start date. Choose the end date.`;
		}

		onRangeChange?.(e, range);
	}

	function clearSelection(e: Event) {
		if (selectionMode === 'range') {
			if (!range.start && !range.end) return;

			range = { start: null, end: null };
			liveMessage = 'Date range cleared.';
			onRangeChange?.(e, range);
			return;
		}

		value = selectionMode === 'multiple' ? [] : null;
		onChange?.(e, value);
	}

	function selectMonth(e: Event, month: Date) {
		page = new SvelteDate(month.setDate(1));
		updateView(e, 'days', page);
	}

	function selectYear(e: Event, year: Date) {
		page.setFullYear(year.getFullYear());
		updateView(e, 'months', year);
	}

	const CALENDAR_STATE = defineState<CalendarViewState>([
		(o) =>
			defineProperty(
				o,
				'value',
				() => value,
				(v) => (value = v)
			),
		(o) =>
			defineProperty(
				o,
				'range',
				() => range,
				(v) => (range = v)
			),
		(o) =>
			defineProperty(
				o,
				'view',
				() => view,
				(v) => (view = v)
			),
		(o) =>
			defineProperty(
				o,
				'page',
				() => page,
				(v) => (page = v)
			),
		(o) =>
			defineProperty(
				o,
				'viewAnimationDirection',
				() => viewAnimationDirection,
				(v) => (viewAnimationDirection = v)
			),
		(o) =>
			defineProperty(
				o,
				'pageAnimationDirection',
				() => pageAnimationDirection,
				(v) => (pageAnimationDirection = v)
			)
	]);

	// svelte-ignore state_referenced_locally
	setCalendarViewContext({
		config: {
			minDate,
			maxDate,
			locale,
			weekStart,
			blackoutDates,
			selectionMode,
			blackoutBreaksRange,
			headers
		},
		get state() {
			return CALENDAR_STATE;
		},
		events: {
			onChange: (e, value) => onChange?.(e, value),
			onViewChange: (e, newView) => onViewChange?.(e, newView)
		},
		methods: {
			updateView,
			updatePage,
			selectDay,
			selectMonth,
			selectYear,
			clearSelection
		}
	});
	$effect.pre(() => {
		pageAnimationDuration = getCSSDuration('--fs-normal-duration') || 333;

		if (floating?.ref && floating.ref instanceof HTMLElement) boundingElement.ref = floating.ref;
	});

	/** Which key zooms out of each view, and where it lands. */
	const ZOOM: Record<View, { key: string; to: View }> = {
		days: { key: 'ArrowUp', to: 'months' },
		months: { key: 'ArrowUp', to: 'years' },
		years: { key: 'ArrowDown', to: 'months' }
	};

	/**
	 * Keys the calendar owns rather than the grid: `Ctrl` + arrow moves between views,
	 * and `Delete` drops a range that can no longer be undone by clicking. Tabspot
	 * never reports either, so one delegated listener on the grid covers all three
	 * views and every cell.
	 */
	function calendarShortcuts(node: HTMLElement) {
		return on(node, 'keydown', (event) => {
			if (selectionMode === 'range' && (event.key === 'Delete' || event.key === 'Backspace')) {
				event.preventDefault();
				clearSelection(event);
				return;
			}

			const zoom = ZOOM[view];

			if (!event.ctrlKey || event.key !== zoom.key) return;

			updateView(event, zoom.to, cellDate(event.target as Element) ?? undefined);
		});
	}

	// Opening as a popup: hand focus to the grid so the arrows work straight away.
	// An inline calendar is just part of the page and must not steal focus.
	onMount(() => {
		if (floating && gridElement) focusCalendarView(gridElement, null, VIEW_PRECISION[view]);
	});

	// The grid is rebuilt on every view change, so the root is registered again
	// each time. This is necessary for tabspot to work correctly.
	$effect(() => {
		if (!gridElement) return;

		setTabspotAttributes({ element: gridElement, config: CALENDAR_GRID_CONFIG });

		if (!pendingFocus) return;

		focusCalendarView(gridElement, pendingFocus.date, pendingFocus.precision);
		pendingFocus = null;
	});
</script>

<!--
@component
A calendar view lets a user view and interact with a calendar that they can navigate by month, year, or decade. A user can select a single date or multiple dates.

This implementation is originally made by Tropix126 in his FluentSvelte library, I have changed several things but thanks to him for the original work.
-->
<div
	class={['fs-calendar-view', { floating }]}
	bind:this={ref}
	in:flyToOffset={floating && floating.ref
		? {
				y: -floating.ref.getBoundingClientRect().height / 2,
				offset:
					floating.ref instanceof HTMLElement
						? getOffset(floating.positionConfig) + floating.ref.getBoundingClientRect().height
						: 0,
				duration: pageAnimationDuration,
				easing: circOut,
				css: 'pointer-events: none;',
				reducedMotion: reducedMotion()
			}
		: undefined}
	{@attach floating?.ref ? _floating(floating.ref, floating.positionConfig) : undefined}
	{...attributes}
>
	<Flyout>
		<CalendarViewControls />
		<div class="calendar-wrapper">
			{#key view}
				<div
					bind:this={gridElement}
					class="calendar-view-stack"
					data-calendar-grid
					{@attach calendarShortcuts}
					in:fadeScale={{
						duration: viewAnimationDirection !== 'neutral' ? 500 : 0,
						easing: circOut,
						baseScale: viewAnimationDirection === 'up' ? 1.29 : 0.84,
						delay: viewAnimationDirection !== 'neutral' ? 150 : 0,
						reducedMotion: reducedMotion()
					}}
					out:fadeScale={{
						duration: viewAnimationDirection !== 'neutral' ? 150 : 0,
						easing: circOut,
						baseScale: viewAnimationDirection === 'up' ? 0.84 : 1.29,
						delay: 0,
						reducedMotion: reducedMotion()
					}}
				>
					{#if view === 'days'}
						<CalendarViewHeader />
					{/if}

					<!--
						The page slides in and out of here. Clipping it at the viewport is what
						keeps a flying month from crossing the weekday names: on a translucent
						surface you cannot mask, only clip.
					-->
					<div class="page-viewport">
						{#if view === 'days'}
							<CalendarViewDays />
						{:else if view === 'months'}
							<CalendarViewMonths />
						{:else if view === 'years'}
							<CalendarViewYears />
						{/if}
					</div>
				</div>
			{/key}
		</div>
		{#if selectionMode === 'range'}
			<!-- Building a range moves no focus and changes no label: this is the only thing that reports it. -->
			<div class="fs-calendar-live-region" role="status" aria-live="polite">{liveMessage}</div>
		{/if}
	</Flyout>
</div>

<style>
	.fs-calendar-view {
		width: 320px;
		min-width: 280px;
		&.floating {
			position: absolute;
			top: 0;
			left: 0;
		}
		& .calendar-wrapper {
			overflow: hidden;
			position: relative;
			width: 100%;
			aspect-ratio: 1;
			& .calendar-view-stack {
				padding: 0 0.5rem;
				position: absolute;
				inset: 0;
				display: flex;
				flex-direction: column;
				background: var(--fs-layer-on-acrylic-default);
				& .page-viewport {
					position: relative;
					overflow: hidden;
					flex: 1;
				}
				& :global([data-calendar-page][inert]) {
					z-index: -1;
				}
			}
		}
		& .fs-calendar-live-region {
			position: absolute;
			width: 1px;
			height: 1px;
			margin: -1px;
			padding: 0;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
			border: 0;
		}
		& :global(.fs-flyout) {
			padding: 0;
			overflow: hidden;
			height: 100%;
			flex-direction: column;
			& :global(.wrapper) {
				gap: 0;
			}
		}
	}
</style>
