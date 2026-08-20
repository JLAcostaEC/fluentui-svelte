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
	import { getPageByOffset, indexOfDate, setCalendarViewContext } from './calendar-view.svelte.js';
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
		element = $bindable(),
		value = $bindable(null),
		view = 'days',
		multiple,
		minDate,
		maxDate,
		locale = 'en-US',
		weekStart = 1,
		blackoutDates,
		headers,
		floating,
		onChange,
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
		if (multiple) {
			if (!Array.isArray(value)) {
				if (value !== null) {
					value = [value];
				} else {
					value = [day];
					return;
				}
			}
			if (indexOfDate(value, day) == -1) {
				value.push(day);
			} else {
				value = value.slice(0, indexOfDate(value, day)).concat(value.slice(indexOfDate(value, day) + 1));
			}
		} else {
			if (Array.isArray(value)) value = null;
			if (day.getTime() === (<Date>value)?.getTime()) {
				value = null;
			} else {
				value = day;
			}
		}
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
			multiple,
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
			selectYear
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
	 * `Ctrl` + arrow moves between views. That is a calendar shortcut rather than a
	 * move inside the grid, so Tabspot never reports it — one delegated listener on
	 * the grid covers all three views and every cell.
	 */
	function zoomShortcut(node: HTMLElement) {
		return on(node, 'keydown', (event) => {
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
	bind:this={element}
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
					{@attach zoomShortcut}
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
