<script lang="ts">
	import { circOut } from 'svelte/easing';
	import { Flyout } from 'fluentui-svelte';
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
	import type { AnimationDirection, CalendarViewProps, CalendarViewState, View } from './types.js';
	import { SvelteDate } from 'svelte/reactivity';

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

	function updateView(e: Event, newView: View) {
		if ((view === 'days' && newView === 'months') || (view === 'months' && newView === 'years')) {
			viewAnimationDirection = 'up';
		} else if ((view === 'years' && newView === 'months') || (view === 'months' && newView === 'days')) {
			viewAnimationDirection = 'down';
		} else {
			viewAnimationDirection = 'neutral';
		}

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
		updateView(e, 'days');
	}

	function selectYear(e: Event, year: Date) {
		page.setFullYear(year.getFullYear());
		updateView(e, 'months');
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
</script>

<!--
@component
A calendar view lets a user view and interact with a calendar that they can navigate by month, year, or decade. A user can select a single date or multiple dates.

This implementation is originally made by Tropix126 in his FluentSvelte library, I have changed several things but almost everything has been devised by him.
-->
<div
	class="fs-calendar-view"
	bind:this={element}
	class:floating
	in:flyToOffset={floating && floating.ref
		? {
				y: -floating.ref.getBoundingClientRect().height / 2,
				offset:
					floating.ref instanceof HTMLElement
						? getOffset(floating.positionConfig) + floating.ref.getBoundingClientRect().height
						: 0,
				duration: pageAnimationDuration,
				easing: circOut,
				css: 'pointer-events: none;'
			}
		: undefined}
	{@attach floating?.ref ? _floating(floating.ref, floating.positionConfig) : undefined}
	{...attributes}
>
	<Flyout>
		<CalendarViewControls />
		<div class="calendar-wrapper">
			{#key view}
				<table
					class="calendar-table"
					in:fadeScale={{
						duration: viewAnimationDirection !== 'neutral' ? 500 : 0,
						easing: circOut,
						baseScale: viewAnimationDirection === 'up' ? 1.29 : 0.84,
						delay: viewAnimationDirection !== 'neutral' ? 150 : 0
					}}
					out:fadeScale={{
						duration: viewAnimationDirection !== 'neutral' ? 150 : 0,
						easing: circOut,
						baseScale: viewAnimationDirection === 'up' ? 0.84 : 1.29,
						delay: 0
					}}
				>
					{#if view === 'days'}
						<CalendarViewHeader />
						<CalendarViewDays />
					{:else if view === 'months'}
						<CalendarViewMonths />
					{:else if view === 'years'}
						<CalendarViewYears />
					{/if}
				</table>
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
			display: grid;
			grid-template-rows: auto 1fr;
			gap: 0.5rem;
			& table {
				padding: 0 0.5rem;
				position: absolute;
				width: 100%;
				display: block;
				inset: 0;
				background: var(--fs-layer-on-acrylic-default);
				& :global(tbody[inert]) {
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
