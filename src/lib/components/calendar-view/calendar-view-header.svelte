<script lang="ts">
	import { getCalendarViewContext, getWeekdayLocale } from './calendar-view.svelte.js';

	const context = getCalendarViewContext();

	if (!context) {
		throw new Error('CalendarViewHeader must be used within a CalendarView');
	}

	let locale = context.config.locale;

	let weekStart = context.config.weekStart;
</script>

<!--
	Decorative: every cell announces its own full date — "Thursday, 15 January 2026" —
	so repeating the weekday here would only add noise. Marking it as a row of
	`columnheader`s would also drag the grid structure into the clipped viewport.
-->
<div class="fs-calendar-view-header" aria-hidden="true">
	<div class="calendar-header-row">
		{#each Array(7) as _, i (i)}
			<div class="calendar-header-item">
				{getWeekdayLocale(i, { format: 'short', locale, offset: weekStart })}
			</div>
		{/each}
	</div>
</div>

<style>
	.fs-calendar-view-header {
		display: flex;
		flex-direction: column;
		padding-top: 0.4rem;
		width: 100%;
		position: relative;
		z-index: 1;
		&::before {
			content: '';
			border-radius: calc(var(--fs-control-overlay-border-radius) - 0.063rem);
			width: 100%;
			height: 100%;
			position: absolute;
			inset: 0;
			background-size: 2.5rem;
			opacity: 0.065;
			filter: grayscale(1);
			z-index: 0;
			pointer-events: none;
		}
		& .calendar-header-row {
			display: grid;
			height: 40px;
			grid-template-columns: repeat(7, 1fr);
			& .calendar-header-item {
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				font-weight: 600;
				font-size: var(--fs-body2-font-size);
				color: var(--fs-text-color-secondary);
			}
		}
	}
</style>
