<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import type { DatePickerProps } from './types.ts';
	import { Flyout, Button, Divider } from '$lib/index.js';
	import { on } from 'svelte/events';
	import { tick } from 'svelte';
	import { PREFIX } from '$constants';
	import { dispatchFieldEvents, floating, invokeHandlers, NativeField } from '$internal';
	import { flip, hide, offset, shift } from '@floating-ui/dom';
	import DynamicCarousel from '$lib/internal/components/dynamic-carousel/dynamic-carousel.svelte';
	import { CheckmarkRegular, DismissRegular } from 'fluentui-icons-svelte';

	const labelContext = claimLabel(() => id);

	let {
		format = 'dd/MM/yyyy',
		value = $bindable(''),
		open = $bindable(false),
		hideYears = false,
		hideMonths = false,
		hideDays = false,
		minYear = new Date().getFullYear() - 100,
		maxYear = new Date().getFullYear() + 100,
		disabledDates = [],
		disabledMonths = [],
		disabledYears = [],
		id = labelContext?.fieldId,
		name = id,
		ref = $bindable(null),
		buttonRef = $bindable(null),
		buttonAttributes,
		wrapperRef = $bindable(null),
		wrapperAttributes,
		disabled,
		readonly,
		onfocus,
		onblur,
		popupLabel = 'Choose a date',
		columnLabels,
		...attributes
	}: DatePickerProps = $props();

	const FALLBACK_ID = $props.id();
	const POPUP_ID = `${PREFIX}datepicker-${FALLBACK_ID}-popup`;

	let popupRef: HTMLElement | null = $state(null);

	const native = new NativeField(
		() => ref,
		() => buttonRef,
		labelContext
	);

	/** Closing always hands the focus back, so the keyboard never lands nowhere. */
	function closePopup() {
		open = false;
		buttonRef?.focus();
	}

	/** A label activates the native input it belongs to, which hands the activation to the button. */
	function openFromField() {
		buttonRef?.focus();
		open = !readonly;
	}

	// Escape has to work from inside the popup too, and the popup is not a descendant
	// of the trigger, so the listener goes on the document.
	$effect(() => {
		if (!open) return;

		return on(document, 'keydown', (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			event.preventDefault();
			closePopup();
		});
	});

	// Move into the dialog on open: the first wheel, so the arrows work straight away.
	$effect(() => {
		if (!open || !popupRef) return;

		tick().then(() => {
			(popupRef?.querySelector<HTMLElement>('[role="listbox"]') ?? popupRef)?.focus();
		});
	});

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
	// Name the columns on the trigger while there is no date, and the listboxes of the popup.
	const labels: Record<Column, string> = $derived({ month: 'Month', day: 'Day', year: 'Year', ...columnLabels });

	// Working selection (actual values). Kept in sync with `value` while the popup is closed,
	// so each open starts from the committed value and Cancel/dismiss discards edits.
	// It starts from `value`, so a popup rendered open on the server shows it too.
	const initial = parseValue(value);
	let month = $state(initial.mo); // 0-11
	let day = $state(initial.d); // 1-31 (raw intent; clamped for display via effectiveDay)
	let year = $state(initial.y);

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

	// Parsed committed value used for the trigger label, so the trigger reflects `value`
	const committed = $derived(parseValue(value));

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
		const next = `${year}-${pad(month + 1)}-${pad(effectiveDay)}`;
		if (next !== value) {
			value = next;
			dispatchFieldEvents(ref);
		}
		closePopup();
	}

	function cancel() {
		closePopup();
	}

	// Trigger label per column
	function display(col: Column): string {
		if (!hasValue) return labels[col];
		if (col === 'month') return MONTH_NAMES[committed.mo];
		if (col === 'day') return pad(committed.d);
		return String(committed.y);
	}
</script>

<div {...wrapperAttributes} class={['fs-date-picker-wrapper', wrapperAttributes?.class]} bind:this={wrapperRef}>
	<button
		{...buttonAttributes}
		{...native.aria(attributes, buttonAttributes, 'button')}
		type="button"
		class={['fs-date-picker', buttonAttributes?.class]}
		{disabled}
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-controls={open ? POPUP_ID : undefined}
		onclick={(e) => invokeHandlers(e, [], [() => (open = !readonly && !open), buttonAttributes?.onclick])}
		onfocus={(e) => invokeHandlers(e, [], [onfocus, buttonAttributes?.onfocus])}
		onblur={(e) => invokeHandlers(e, [], [onblur, buttonAttributes?.onblur])}
		bind:this={buttonRef}
	>
		{#each columns as col, idx (col)}
			{#if idx > 0}
				<Divider as="span" vertical aria-hidden="true" />
			{/if}
			<span class="picker-content">{display(col)}</span>
		{/each}
	</button>

	<!-- The field of the form: submitted, validated and reset like any date input,
	     behind the button and out of the tab order, since the button is what people use. See `NativeField`. -->
	<input
		{...attributes}
		{name}
		{id}
		min={attributes.min ?? `${String(minYear).padStart(4, '0')}-01-01`}
		max={attributes.max ?? `${String(maxYear).padStart(4, '0')}-12-31`}
		class="native-field"
		aria-hidden={native.reported ? undefined : 'true'}
		type="date"
		tabindex={-1}
		{disabled}
		{readonly}
		bind:value
		bind:this={ref}
		onclick={openFromField}
	/>
</div>

{#if open}
	<Flyout
		{@attach floating(buttonRef, {
			placement: 'bottom',
			middleware: [
				offset(({ rects }) => {
					// Place over the reference element
					return -rects.reference.height / 2 - rects.floating.height / 2;
				}),
				flip(),
				shift(),
				hide()
			],
			strategy: 'fixed'
		})}
		id={POPUP_ID}
		role="dialog"
		aria-modal="true"
		aria-label={popupLabel}
		tabindex={-1}
		bind:ref={popupRef}
		class="date-picker-flyout"
	>
		<div class="carousel-wrapper">
			<div class="selection-bar"></div>
			{#each columns as col (col)}
				<div class="carousel-col col-{col}">
					{#if col === 'month'}
						<DynamicCarousel
							label={labels.month}
							values={MONTH_NAMES}
							selectedIndex={month}
							disabledIndices={disabledMonthIdx}
							onSelected={(_, i) => (month = i)}
						/>
					{:else if col === 'day'}
						{#key `${year}-${month}`}
							<DynamicCarousel
								label={labels.day}
								values={dayList}
								selectedIndex={effectiveDay - 1}
								disabledIndices={disabledDayIdx}
								onSelected={(_, i) => (day = i + 1)}
							/>
						{/key}
					{:else}
						<DynamicCarousel
							label={labels.year}
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
	/* The box of the button, which the native field covers so its validation message points at the button. */
	.fs-date-picker-wrapper {
		display: flex;
		position: relative;
		inline-size: fit-content;
	}
	.fs-date-picker-wrapper:has(> .native-field:is(:user-invalid, [aria-invalid='true'])) {
		& .picker-content {
			color: var(--fs-system-critical);
		}
		& .fs-date-picker::after,
		& :global(.fs-divider) {
			background: var(--fs-system-critical);
		}
	}
	.native-field {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		margin: 0;
		box-sizing: border-box;
		opacity: 0;
		pointer-events: none;
	}
	.fs-date-picker {
		display: flex;
		flex: 1 1 auto;
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
		z-index: 10;
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
