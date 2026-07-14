<script lang="ts">
	import { Button, CalendarView } from '$lib/index.js';
	import { CalendarLtrRegular } from 'fluentui-icons-svelte';
	import type { CalendarDatePickerProps } from './types.js';
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';
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
		element = $bindable(),
		headers,
		maxDate,
		minDate,
		weekStart,
		onChange
	}: CalendarDatePickerProps = $props();

	let open = $state(false);

	onMount(() => {
		const off = on(document, 'click', (event: MouseEvent) => {
			if (element && !element.contains(event.target as Node)) {
				open = false;
			}
		});

		return () => off();
	});
</script>

<div class="fs-calendar-date-picker" bind:this={element}>
	<Button appearance="standard" onclick={() => (open = !open)}>
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
			floating={{
				ref: element,
				positionConfig: {
					placement: 'bottom-start',
					middleware: [offset(8), flip(), shift({ padding: 8 }), hide()]
				}
			}}
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
