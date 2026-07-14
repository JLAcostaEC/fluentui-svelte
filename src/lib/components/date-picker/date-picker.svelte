<script lang="ts">
	import { Flyout, Button, Divider } from '$lib/index.js';
	import { floating } from '$internal';
	import { flip, hide, offset, shift } from '@floating-ui/dom';
	import DynamicCarousel from '$lib/internal/components/dynamic-carousel/dynamic-carousel.svelte';
	import { CheckmarkRegular, DismissRegular } from 'fluentui-icons-svelte';

	let {
		format = 'dd/MM/yyyy',
		value = $bindable(''),
		open = $bindable(false),
		hideYears = false,
		hideMonths = false,
		hideDays = false,
		minYear = new Date().getFullYear() - 100,
		maxYear = new Date().getFullYear(),
		disabledDates = [],
		disabledMonths = [],
		disabledYears = [],
		element = $bindable(),
		inputElement = $bindable()
	}: {
		format?: 'MM/dd/yyyy' | 'dd/MM/yyyy';
		/** Selected date as `YYYY-MM-DD` (matches the underlying `<input type="date">`). */
		value?: string;
		open?: boolean;
		hideYears?: boolean;
		hideMonths?: boolean;
		hideDays?: boolean;
		minYear?: number;
		maxYear?: number;
		/** Specific days (year-month-day) that cannot be selected. */
		disabledDates?: Date[];
		/** Specific months (by month + year) that cannot be selected. */
		disabledMonths?: Date[];
		/** Specific years (by year) that cannot be selected. */
		disabledYears?: Date[];
		element?: HTMLElement;
		inputElement?: HTMLInputElement;
	} = $props();

	type Column = 'month' | 'day' | 'year';

	const MONTH_NAMES = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const LABELS: Record<Column, string> = { month: 'Month', day: 'Day', year: 'Year' };

	// Working selection (actual values). Kept in sync with `value` while the popup is closed,
	// so each open starts from the committed value and Cancel/dismiss discards edits.
	let month = $state(new Date().getMonth()); // 0-11
	let day = $state(new Date().getDate()); // 1-31 (raw intent; clamped for display via effectiveDay)
	let year = $state(new Date().getFullYear());

	// Descending list of selectable years within [minYear, maxYear].
	const yearsList = $derived(Array.from({ length: Math.max(0, maxYear - minYear) + 1 }, (_, i) => maxYear - i));
	const yearStrings = $derived(yearsList.map(String));

	// Days available in the selected month/year (leap-year aware): new Date(y, m + 1, 0) === last day.
	const daysInMonth = $derived(new Date(year, month + 1, 0).getDate());
	const effectiveDay = $derived(Math.min(day, daysInMonth));
	const dayList = $derived(Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0')));

	const yearIdx = $derived(Math.max(0, yearsList.indexOf(year)));

	// The trigger shows the committed value; `true` once `value` holds a full date.
	const hasValue = $derived(/^\d{4}-\d{2}-\d{2}$/.test(value ?? ''));

	// Columns to render, ordered by `format` and filtered by the hide* flags.
	const columns = $derived.by<Column[]>(() => {
		const base: Column[] = format === 'dd/MM/yyyy' ? ['day', 'month', 'year'] : ['month', 'day', 'year'];
		const hidden: Record<Column, boolean> = { month: hideMonths, day: hideDays, year: hideYears };
		return base.filter((c) => !hidden[c]);
	});

	// --- disabled** → disabled carousel indices (arrays of real, 0-based indices) ---
	const disabledYearsSet = $derived(new Set(disabledYears.map((d) => d.getFullYear())));
	const disabledYearIdx = $derived(yearsList.flatMap((y, i) => (disabledYearsSet.has(y) ? [i] : [])));
	const disabledMonthIdx = $derived(
		MONTH_NAMES.flatMap((_, i) =>
			disabledMonths.some((d) => d.getFullYear() === year && d.getMonth() === i) ? [i] : []
		)
	);
	const disabledDayIdx = $derived(
		dayList.flatMap((_, i) =>
			disabledDates.some((d) => d.getFullYear() === year && d.getMonth() === month && d.getDate() === i + 1) ? [i] : []
		)
	);

	// Whether the currently composed date lands on a disabled value (blocks Confirm as a backstop;
	// the carousels already skip disabled items while scrolling).
	const isSelectionDisabled = $derived(
		disabledYearsSet.has(year) ||
			disabledMonths.some((d) => d.getFullYear() === year && d.getMonth() === month) ||
			disabledDates.some((d) => d.getFullYear() === year && d.getMonth() === month && d.getDate() === effectiveDay)
	);

	const pad = (n: number) => n.toString().padStart(2, '0');

	function parseValue(v: string) {
		const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v ?? '');
		const t = new Date();
		const raw = m ? { y: +m[1], mo: +m[2] - 1, d: +m[3] } : { y: t.getFullYear(), mo: t.getMonth(), d: t.getDate() };
		const y = Math.min(maxYear, Math.max(minYear, raw.y));
		const mo = Math.min(11, Math.max(0, raw.mo));
		const dim = new Date(y, mo + 1, 0).getDate();
		const d = Math.min(dim, Math.max(1, raw.d));
		return { y, mo, d };
	}

	// Keep the working selection synced with `value` while the popup is closed.
	$effect(() => {
		if (!open) {
			const { y, mo, d } = parseValue(value);
			year = y;
			month = mo;
			day = d;
		}
	});

	function confirm() {
		value = `${year}-${pad(month + 1)}-${pad(effectiveDay)}`;
		open = false;
	}

	function cancel() {
		open = false;
	}

	// Trigger label per column: the live selection while open, the committed value once set,
	// otherwise the placeholder column name.
	function display(col: Column): string {
		if (!open && !hasValue) return LABELS[col];
		if (col === 'month') return MONTH_NAMES[month];
		if (col === 'day') return pad(effectiveDay);
		return String(year);
	}
</script>

<!--
$config: {
  "status": "AI",
  "icon": "CalendarMonthFilled"
}
-->
<div
	class="fs-date-picker"
	role="button"
	tabindex="0"
	aria-haspopup="dialog"
	aria-expanded={open}
	onclick={() => (open = !open)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open = !open;
		}
	}}
	bind:this={element}
>
	{#each columns as col, idx (col)}
		{#if idx > 0}
			<Divider as="span" vertical />
		{/if}
		<span class="picker-content">{display(col)}</span>
	{/each}
	<input type="date" class="date-picker-input" {value} bind:this={inputElement} />
</div>

{#if open}
	<Flyout
		{@attach floating(element, {
			placement: 'bottom',
			middleware: [
				offset(({ rects }) => {
					return -rects.reference.height / 2 - rects.floating.height / 2;
				}),
				flip(),
				shift(),
				hide()
			],
			strategy: 'fixed'
		})}
		reference={element}
		class="date-picker-flyout"
	>
		<div class="carousel-wrapper">
			<div class="selection-bar"></div>
			{#each columns as col (col)}
				<div class="carousel-col col-{col}">
					{#if col === 'month'}
						<DynamicCarousel
							values={MONTH_NAMES}
							selectedIndex={month}
							disabledIndices={disabledMonthIdx}
							onSelected={(_, i) => (month = i)}
						/>
					{:else if col === 'day'}
						{#key `${year}-${month}`}
							<DynamicCarousel
								values={dayList}
								selectedIndex={effectiveDay - 1}
								disabledIndices={disabledDayIdx}
								onSelected={(_, i) => (day = i + 1)}
							/>
						{/key}
					{:else}
						<DynamicCarousel
							values={yearStrings}
							selectedIndex={yearIdx}
							disabledIndices={disabledYearIdx}
							onSelected={(_, i) => (year = yearsList[i])}
						/>
					{/if}
				</div>
			{/each}
		</div>
		<div class="action-bar">
			<Button class="justify" appearance="subtle" aria-label="Confirm" disabled={isSelectionDisabled} onclick={confirm}>
				<CheckmarkRegular />
			</Button>
			<Button class="justify" appearance="subtle" aria-label="Cancel" onclick={cancel}>
				<DismissRegular />
			</Button>
		</div>
	</Flyout>
{/if}

<style>
	.fs-date-picker {
		display: flex;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		font-size: var(--fs-body-font-size);
		line-height: var(--fs-body-line-height);
		color: var(--fs-text-primary);
		background: var(--fs-control-fill-default);
		border: none;
		padding: 1px;
		cursor: pointer;
		outline: none;
		user-select: none;
		&:after {
			content: '';
			inset: 0;
			position: absolute;
			padding: 0.063rem;
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			mask-composite: exclude;
			border-radius: inherit;
		}
		&::after {
			background: var(--fs-elevation-control-border);
		}
		&:hover {
			background: var(--fs-control-fill-secondary);
		}
		&:active {
			color: var(--fs-text-secondary);
			&::after {
				background: var(--fs-control-stroke-default);
			}
		}
		&:disabled,
		&.disabled {
			background: var(--fs-control-fill-disabled) !important;
			color: var(--fs-text-disabled) !important;
			&::after {
				background: var(--fs-control-stroke-default) !important;
			}
		}
		& .date-picker-input {
			appearance: none;
			background: transparent;
			outline: none;
			border: none;
			width: 0;
			height: 0;
			opacity: 0;
			pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
		}
		& .picker-content {
			display: flex;
			align-items: center;
			padding: 0.375rem 1.626rem 0.5rem 1.626rem;
			&:first-child {
				padding-right: 2rem;
			}
		}
	}
	:global(.date-picker-flyout) {
		flex-direction: column;
		position: fixed !important;
		top: 0;
		left: 0;
		max-width: min-content;
		padding: 0 !important;
		& .wrapper {
			gap: 0 !important;
		}
		& .carousel-wrapper {
			display: flex;
			position: relative;
			width: max-content;
			min-width: max-content;
			padding: 0 0.4rem !important;
		}
		& .carousel-col {
			&.col-month {
				width: 130px;
			}
			&.col-day {
				width: 60px;
			}
			&.col-year {
				width: 80px;
			}
			& :global(.fs-dynamic-carousel) {
				width: 100%;
			}
			&:not(:last-child) :global(.fs-dynamic-carousel-track) {
				border-right: 1px solid var(--fs-control-stroke-default);
			}
		}
		& .selection-bar {
			position: absolute;
			top: 50%;
			left: 0.4rem;
			width: calc(100% - 0.8rem);
			height: 40px;
			background: var(--fs-accent-fill-default);
			transform: translateY(-50%);
			border-radius: var(--fs-control-border-radius);
			z-index: -1;
		}
		& .action-bar {
			display: flex;
			width: 100%;
			padding: 0.2rem;
			border-top: 1px solid var(--fs-control-stroke-default);
			& :global(.justify) {
				flex: 1;
			}
		}
	}
</style>
