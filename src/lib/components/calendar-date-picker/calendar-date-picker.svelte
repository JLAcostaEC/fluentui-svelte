<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import { Button, CalendarView } from '$lib/index.js';
	import { CalendarLtrRegular } from 'fluentui-icons-svelte';
	import type { CalendarDatePickerProps } from './types.js';
	import { onMount, tick } from 'svelte';
	import { on } from 'svelte/events';
	import { dispatchFieldEvents, invokeHandlers, NativeField } from '$internal';
	import { PREFIX } from '$constants';
	import { flip, hide, offset, shift } from '@floating-ui/dom';

	/** The Label the field is inside, when the label is for it. */
	const labelContext = claimLabel(() => id);

	let {
		wrapperAttributes,
		disabled,
		readonly,
		onfocus,
		onblur,
		value = $bindable(null),
		locale = 'en-US',
		format = {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		},
		calendarPosition: _positionConfig,
		blackoutDates,
		wrapperRef = $bindable(null),
		headers,
		maxDate,
		minDate,
		weekStart,
		onChange,
		id = labelContext?.fieldId,
		name = id,
		ref = $bindable(null),
		buttonRef = $bindable(null),
		buttonProps,
		popupRef = $bindable(null),
		popupLabel = 'Choose a date',
		...attributes
	}: CalendarDatePickerProps = $props();

	const FALLBACK_ID = $props.id();
	const POPUP_ID = `${PREFIX}calendardatepicker-${FALLBACK_ID}-popup`;

	let open = $state(false);

	const native = new NativeField(
		() => ref,
		() => buttonRef,
		labelContext
	);

	/** Closing always hands the focus back to the trigger button. */
	function closePopup() {
		open = false;
		buttonRef?.focus();
	}

	/** A label activates the native input it belongs to, which hands the activation to the button. */
	function openFromField() {
		buttonRef?.focus();
		open = !readonly;
	}

	const pad = (n: number, length = 2) => String(n).padStart(length, '0');

	/** The native input holds the calendar day as `YYYY-MM-DD`, read in local time... no UTC offset shifts it. */
	function toFieldValue(date: Date | null | undefined) {
		return date ? `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '';
	}

	function fromFieldValue(text: string) {
		const [year, month, day] = text.split('-').map(Number);
		return text ? new Date(year, month - 1, day) : null;
	}

	let positionConfig = $derived({
		..._positionConfig,
		placement: _positionConfig?.placement ?? 'bottom-start',
		middleware: _positionConfig?.middleware ?? [offset(8), flip(), shift({ padding: 8 }), hide()]
	});

	onMount(() => {
		const off = on(document, 'click', (event: MouseEvent) => {
			if (wrapperRef && !wrapperRef.contains(event.target as Node)) {
				open = false;
			}
		});

		return () => off();
	});

	$effect(() => {
		if (!open) return;

		return on(document, 'keydown', (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			event.preventDefault();
			closePopup();
		});
	});

	// Move into the dialog on open
	$effect(() => {
		if (!open || !popupRef) return;

		tick().then(() => {
			(popupRef?.querySelector<HTMLElement>('[role="gridcell"] button') ?? popupRef)?.focus();
		});
	});
</script>

<div {...wrapperAttributes} class={['fs-calendar-date-picker', wrapperAttributes?.class]} bind:this={wrapperRef}>
	<Button
		{...buttonProps}
		{...native.aria(attributes, buttonProps, 'button')}
		appearance="standard"
		type="button"
		class={['fs-calendar-date-picker-button', buttonProps?.class]}
		disabled={disabled ?? false}
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-controls={open ? POPUP_ID : undefined}
		bind:ref={buttonRef}
		onclick={(e) => invokeHandlers(e, [], [() => (open = !readonly && !open), buttonProps?.onclick])}
		onfocus={(e) => invokeHandlers(e, [], [onfocus, buttonProps?.onfocus])}
		onblur={(e) => invokeHandlers(e, [], [onblur, buttonProps?.onblur])}
	>
		{#if value}
			{value.toLocaleDateString(locale, format)}
		{:else}
			Pick a date
		{/if}
		<CalendarLtrRegular width="1rem" />
	</Button>
	<!-- The field of the form: submitted, validated and reset like any date input, behind the
	     button and out of the tab order, since the button is what people use. See `NativeField`. -->
	<input
		{...attributes}
		{id}
		{name}
		class="native-field"
		aria-hidden={native.reported ? undefined : 'true'}
		type="date"
		tabindex={-1}
		{disabled}
		{readonly}
		bind:value={
			() => toFieldValue(value),
			(text) => {
				if (text !== toFieldValue(value)) value = fromFieldValue(text);
			}
		}
		bind:this={ref}
		onclick={openFromField}
	/>
	{#if open}
		<CalendarView
			bind:value
			bind:ref={popupRef}
			id={POPUP_ID}
			role="dialog"
			aria-modal="true"
			aria-label={popupLabel}
			tabindex={-1}
			floating={{ ref: wrapperRef, positionConfig }}
			onChange={(event, date) => {
				onChange?.(event, date as Date | null);
				dispatchFieldEvents(ref);
			}}
			{blackoutDates}
			{headers}
			{maxDate}
			{minDate}
			{weekStart}
		/>
	{/if}
</div>

<style>
	.fs-calendar-date-picker {
		position: relative;
		inline-size: fit-content;
		& .native-field {
			position: absolute;
			inset: 0;
			inline-size: 100%;
			block-size: 100%;
			margin: 0;
			box-sizing: border-box;
			opacity: 0;
			pointer-events: none;
		}
		&:has(> .native-field:is(:user-invalid, [aria-invalid='true'])) :global(.fs-calendar-date-picker-button) {
			color: var(--fs-system-critical);
			&::after {
				background: var(--fs-system-critical);
			}
		}
	}
</style>
