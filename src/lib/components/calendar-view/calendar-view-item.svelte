<script lang="ts">
	import type { CalendarViewItemProps } from './types.js';

	let {
		selected,
		disabled,
		current,
		outOfRange,
		blackout,
		variant = 'day',
		header = '',
		children,
		buttonAttributes,
		...attributes
	}: CalendarViewItemProps = $props();
</script>

<td class="fs-calendar-view-item variant-{variant === 'day' ? 'day' : 'month-year'}" role="gridcell" {...attributes}>
	<button
		type="button"
		class="calendar-item-button"
		class:selected
		class:disabled
		class:current
		class:out-of-range={outOfRange}
		class:blackout
		aria-disabled={disabled}
		{disabled}
		{...buttonAttributes}
	>
		{#if header}
			<small>{header}</small>
		{/if}
		{@render children?.()}
	</button>
</td>

<style>
	.fs-calendar-view-item {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		& .calendar-item-button {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: var(--fs-body2-font-size);
			color: var(--fs-text-primary);
			border: 1px solid transparent;
			border-radius: 999px;
			background: var(--fs-fill-subtle-transparent);
			cursor: pointer;
			position: relative;
			outline: none;
			gap: 0.5rem;
			width: 100%;
			user-select: none;
			aspect-ratio: 1;
			&:hover {
				background-color: var(--fs-subtle-fill-secondary);
			}
			&:focus-visible {
				outline: 0.125rem var(--fs-focus-stroke-outer) solid;
				outline-offset: 0.063rem;
			}
			&:active {
				color: var(--fs-text-tertiary);
				background: var(--fs-subtle-fill-tertiary);
				&::after {
					background: var(--fs-control-stroke-default);
				}
			}
			&.out-of-range {
				color: var(--fs-text-secondary);
				&:active {
					color: var(--fs-text-tertiary);
				}
			}
			&.disabled {
				cursor: not-allowed;
				color: var(--fs-text-disabled);
				background-color: var(--fs-subtle-fill-disabled);
				&.blackout:after {
					content: none;
				}
			}
			&.blackout {
				pointer-events: none;
				&::after {
					content: '';
					transform-origin: center;
					position: absolute;
					transform: matrix(-0.71, -0.71, -0.71, 0.71, 0, 0);
					border-block-start: 1px solid var(--fs-control-strong-stroke-default);
					width: 70%;
					height: 1px;
				}
			}
			&.selected {
				color: var(--fs-accent-text-primary);
				border: 1px solid var(--fs-accent-fill-default);
				&:hover {
					background-color: var(--fs-subtle-fill-secondary);
					color: var(--fs-accent-text-secondary);
				}
				&:active {
					background-color: var(--fs-subtle-fill-tertiary);
					color: var(--fs-accent-text-tertiary);
				}
				&.disabled {
					background-color: var(--fs-subtle-fill-disabled);
					color: var(--fs-text-disabled);
				}
				&.current {
					box-shadow: inset 0 0 0 1px var(--fs-text-on-accent-primary);
				}
				&.blackout::after {
					border-block-start-color: var(--fs-accent-tertiary);
				}
			}
			&.current {
				color: var(--fs-text-on-accent-primary);
				background-color: var(--fs-accent-fill-default);
				&:hover {
					background-color: var(--fs-accent-fill-secondary);
					color: var(--fs-text-on-accent-secondary);
				}
				&:active {
					background-color: var(--fs-accent-fill-tertiary);
					color: var(--fs-text-on-accent-secondary);
				}
				&.disabled {
					background-color: var(--fs-accent-fill-disabled);
					color: var(--fs-text-disabled);
				}
				&.blackout::after {
					border-block-start-color: var(--fs-accent-tertiary);
				}
			}
			& small {
				pointer-events: none;
				position: absolute;
				inline-size: 100%;
				text-align: center;
				color: inherit;
				line-height: 12px;
				font-size: var(--fs-caption2-font-size);
				font-weight: 500;
				inset: 0;
			}
		}
		&.variant-month-year small {
			inset-block-start: 9.58px;
		}
	}
</style>
