<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import type { TimePickerProps } from './types.ts';
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
		format = 24,
		value = $bindable(''),
		open = $bindable(false),
		hideHours = false,
		hideMinutes = false,
		hideSeconds = false,
		id = labelContext?.fieldId,
		name = id,
		ref = $bindable(null),
		buttonRef = $bindable(null),
		buttonAttributes,
		wrapperRef = $bindable(null),
		wrapperAttributes,
		disabled,
		readonly,
		step,
		onfocus,
		onblur,
		popupLabel = 'Choose a time',
		...attributes
	}: TimePickerProps = $props();

	const FALLBACK_ID = $props.id();
	const POPUP_ID = `${PREFIX}timepicker-${FALLBACK_ID}-popup`;

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

	type Column = 'hour' | 'minute' | 'second' | 'meridiem';

	const pad = (n: number) => n.toString().padStart(2, '0');
	const HOURS_24 = Array.from({ length: 24 }, (_, i) => pad(i));
	const HOURS_12 = Array.from({ length: 12 }, (_, i) => pad(i === 0 ? 12 : i)); // 12, 01 … 11
	const SIXTY = Array.from({ length: 60 }, (_, i) => pad(i));
	const MERIDIEM = ['AM', 'PM'];
	const LABELS: Record<Column, string> = {
		hour: 'Hour',
		minute: 'Minute',
		second: 'Second',
		meridiem: 'AM/PM'
	};

	const hour12 = $derived(format === 12);

	// Working selection — canonical 24h values, synced with `value` while the popup is closed.
	let hour = $state(new Date().getHours()); // 0-23
	let minute = $state(new Date().getMinutes()); // 0-59
	let second = $state(new Date().getSeconds()); // 0-59

	const isPM = $derived(hour >= 12);
	// 12h wheel index: hour % 12 (0 → "12", 1 → "01", …, 11 → "11").
	const hour12Index = $derived(hour % 12);

	// Columns to render, filtered by the hide* flags; AM/PM only in 12h mode.
	const columns = $derived.by<Column[]>(() => {
		const cols: Column[] = [];
		if (!hideHours) cols.push('hour');
		if (!hideMinutes) cols.push('minute');
		if (!hideSeconds) cols.push('second');
		if (hour12) cols.push('meridiem');
		return cols;
	});

	const hasValue = $derived(/^\d{2}:\d{2}(:\d{2})?$/.test(value ?? ''));

	function parseValue(v: string) {
		const m = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(v ?? '');
		const t = new Date();
		const raw = m
			? { h: +m[1], mi: +m[2], s: m[3] ? +m[3] : 0 }
			: { h: t.getHours(), mi: t.getMinutes(), s: t.getSeconds() };
		return {
			h: Math.min(23, Math.max(0, raw.h)),
			mi: Math.min(59, Math.max(0, raw.mi)),
			s: Math.min(59, Math.max(0, raw.s))
		};
	}

	// Keep the working selection synced with `value` while the popup is closed.
	$effect(() => {
		if (!open) {
			const { h, mi, s } = parseValue(value);
			hour = h;
			minute = mi;
			second = s;
		}
	});

	// 12h wheel index → canonical hour, keeping the current meridiem.
	function setHour12(i: number) {
		hour = (i % 12) + (isPM ? 12 : 0);
	}
	// AM/PM wheel index (0 = AM, 1 = PM) → canonical hour, keeping the clock hour.
	function setMeridiem(i: number) {
		hour = (hour % 12) + (i === 1 ? 12 : 0);
	}

	function confirm() {
		const next = `${pad(hour)}:${pad(minute)}${hideSeconds ? '' : `:${pad(second)}`}`;
		if (next !== value) {
			value = next;
			dispatchFieldEvents(ref);
		}
		closePopup();
	}

	function cancel() {
		closePopup();
	}

	// Trigger label per column: the live selection while open, the committed value once set,
	// otherwise the placeholder column name.
	function display(col: Column): string {
		if (!open && !hasValue) return LABELS[col];
		if (col === 'hour') return hour12 ? HOURS_12[hour12Index] : pad(hour);
		if (col === 'minute') return pad(minute);
		if (col === 'second') return pad(second);
		return isPM ? 'PM' : 'AM';
	}
</script>

<div {...wrapperAttributes} class={['fs-time-picker-wrapper', wrapperAttributes?.class]} bind:this={wrapperRef}>
	<button
		{...buttonAttributes}
		{...native.aria(attributes, buttonAttributes, 'button')}
		type="button"
		class={['fs-time-picker', buttonAttributes?.class]}
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

	<!-- The field of the form: submitted, validated and reset like any time input,
	     behind the button and out of the tab order, since the button is what people use. See `NativeField`.
	     Seconds need a step of one to be a valid value. -->
	<input
		{...attributes}
		{id}
		{name}
		class="native-field"
		aria-hidden={native.reported ? undefined : 'true'}
		type="time"
		tabindex={-1}
		step={step ?? (hideSeconds ? undefined : 1)}
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
					return -rects.reference.height / 2 - rects.floating.height / 2;
				}),
				flip(),
				shift(),
				hide()
			],
			strategy: 'fixed'
		})}
		reference={buttonRef}
		id={POPUP_ID}
		role="dialog"
		aria-modal="true"
		aria-label={popupLabel}
		tabindex={-1}
		bind:ref={popupRef}
		class="time-picker-flyout"
	>
		<div class="carousel-wrapper">
			<div class="selection-bar"></div>
			{#each columns as col (col)}
				<div class="carousel-col col-{col}">
					{#if col === 'hour'}
						{#if hour12}
							<DynamicCarousel values={HOURS_12} selectedIndex={hour12Index} onSelected={(_, i) => setHour12(i)} />
						{:else}
							<DynamicCarousel values={HOURS_24} selectedIndex={hour} onSelected={(_, i) => (hour = i)} />
						{/if}
					{:else if col === 'minute'}
						<DynamicCarousel values={SIXTY} selectedIndex={minute} onSelected={(_, i) => (minute = i)} />
					{:else if col === 'second'}
						<DynamicCarousel values={SIXTY} selectedIndex={second} onSelected={(_, i) => (second = i)} />
					{:else}
						<DynamicCarousel
							values={MERIDIEM}
							selectedIndex={isPM ? 1 : 0}
							infinite={false}
							inertia={false}
							onSelected={(_, i) => setMeridiem(i)}
						/>
					{/if}
				</div>
			{/each}
		</div>
		<div class="action-bar">
			<Button class="justify" appearance="subtle" aria-label="Confirm" onclick={confirm}>
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
	.fs-time-picker-wrapper {
		display: flex;
		position: relative;
		inline-size: fit-content;
	}
	.fs-time-picker-wrapper:has(> .native-field:is(:user-invalid, [aria-invalid='true'])) {
		& .picker-content {
			color: var(--fs-system-critical);
		}
		& .fs-time-picker::after,
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
	.fs-time-picker {
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
	:global(.time-picker-flyout) {
		flex-direction: column;
		position: fixed !important;
		top: 0;
		left: 0;
		z-index: 110;
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
			width: 64px;
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
