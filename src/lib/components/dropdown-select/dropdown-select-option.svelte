<script lang="ts">
	import CheckmarkFilled from 'fluentui-icons-svelte/CheckmarkFilled.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		value,
		text,
		disabled,
		ref = $bindable(),
		class: classes,
		children,
		...attributes
	}: {
		value?: string;
		text?: string;
		disabled?: boolean;
		ref?: HTMLElement;
		children?: Snippet;
	} & HTMLAttributes<HTMLOptionElement> = $props();
</script>

<option class="fs-dropdown-select-option {classes}" {value} {disabled} bind:this={ref} {...attributes}>
	<span class="option-content">
		<CheckmarkFilled class="checkmark" width="16" height="16" />
		{#if text}
			<span class="value-text">{text}</span>
		{/if}
		<span>
			{@render children?.()}
		</span>
	</span>
</option>

<style>
	.fs-dropdown-select-option {
		padding: 0 !important;
		display: flex;
		border-radius: var(--fs-control-border-radius);
		
		/* User-Agent Override Styles Hack  */
		transition: background calc(infinity * 1s) !important;

		&::checkmark,
		& :global(.checkmark),
		& .value-text {
			display: none;
		}
		& .option-content {
			border-radius: var(--fs-control-border-radius);
			font-size: var(--fs-body2-font-size);
			color: var(--fs-text-primary);
			border: none;
			padding: 0.275rem 0.5rem 0.4rem 0.5rem;
			position: relative;
			outline: none;
			display: flex;
			width: 100%;
			gap: 0.5rem;
			align-items: center;
			text-decoration: none;
			user-select: none;
			max-height: unset;
		}
		&:not(:last-child) {
			margin-bottom: 0.25rem;
		}
		&[disabled] {
			cursor: not-allowed;
			background: var(--fs-subtle-fill-transparent) !important;
			color: var(--fs-text-disabled) !important;
		}
		&[hidden] {
			display: none;
		}
		&:checked {
			background: var(--fs-subtle-fill-secondary);
			padding: 0.275rem 0.5rem 0.4rem 0.5rem;
			& :global(.checkmark) {
				display: flex;
			}
			&::after {
				opacity: 1;
			}
		}
		&:hover .option-content {
			background: var(--fs-subtle-fill-secondary);
		}
		&:focus-visible {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.063rem;
		}
	}
</style>
