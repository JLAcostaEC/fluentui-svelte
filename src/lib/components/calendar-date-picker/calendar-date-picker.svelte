<script lang="ts">
	import { Button, CalendarView } from '$lib/index.js';
	import { CalendarLtrRegular } from 'fluentui-icons-svelte';
	import type { CalendarDatePickerProps } from './types.js';
	import { onMount, tick } from 'svelte';
	import { on } from 'svelte/events';
	import { PREFIX } from '$constants';
	import { flip, hide, offset, shift } from '@floating-ui/dom';

	let {
		value = $bindable(null),
		locale = 'en-US',
		format = {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		},
		calendarPosition: _positionConfig,
		blackoutDates,
		ref = $bindable(),
		headers,
		maxDate,
		minDate,
		weekStart,
		onChange,
		triggerRef = $bindable(),
		popupRef = $bindable(),
		popupLabel = 'Choose a date',
		...attributes
	}: CalendarDatePickerProps = $props();

	const FALLBACK_ID = $props.id();
	const POPUP_ID = `${PREFIX}calendardatepicker-${FALLBACK_ID}-popup`;

	let open = $state(false);

	/** Closing always hands the focus back to the trigger button. */
	function closePopup() {
		open = false;
		triggerRef?.focus();
	}

	let positionConfig = $derived({
		..._positionConfig,
		placement: _positionConfig?.placement ?? 'bottom-start',
		middleware: _positionConfig?.middleware ?? [offset(8), flip(), shift({ padding: 8 }), hide()]
	});

	onMount(() => {
		const off = on(document, 'click', (event: MouseEvent) => {
			if (ref && !ref.contains(event.target as Node)) {
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

<div class="fs-calendar-date-picker" bind:this={ref} {...attributes}>
	<Button
		appearance="standard"
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-controls={open ? POPUP_ID : undefined}
		bind:ref={triggerRef}
		onclick={() => (open = !open)}
	>
		{#if value}
			{value.toLocaleDateString(locale, format)}
		{:else}
			Pick a date
		{/if}
		<CalendarLtrRegular width="1rem" />
	</Button>
	{#if open}
		<CalendarView
			bind:value
			bind:ref={popupRef}
			id={POPUP_ID}
			role="dialog"
			aria-modal="true"
			aria-label={popupLabel}
			tabindex={-1}
			floating={{ ref, positionConfig }}
			onChange={onChange as any}
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
	}
</style>
