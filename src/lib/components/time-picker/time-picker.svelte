<script lang="ts">
	import type { TimePickerProps } from './types.ts';
	import { Flyout, Button, Divider } from '$lib/index.js';
	import { floating } from '$internal';
	import { flip, hide, offset, shift } from '@floating-ui/dom';
	import DynamicCarousel from '$lib/internal/components/dynamic-carousel/dynamic-carousel.svelte';
	import { CheckmarkRegular, DismissRegular } from 'fluentui-icons-svelte';

	let {
		format = 24,
		value = $bindable(''),
		open = $bindable(false),
		hideHours = false,
		hideMinutes = false,
		hideSeconds = false,
		element = $bindable(),
		inputElement = $bindable()
	}: TimePickerProps = $props();

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
		value = `${pad(hour)}:${pad(minute)}${hideSeconds ? '' : `:${pad(second)}`}`;
		open = false;
	}

	function cancel() {
		open = false;
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

<div
	class="fs-time-picker"
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
	<input type="time" step={hideSeconds ? undefined : 1} class="time-picker-input" {value} bind:this={inputElement} />
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
	.fs-time-picker {
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
		& .time-picker-input {
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
	:global(.time-picker-flyout) {
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
