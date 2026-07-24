<script lang="ts">
	import ChevronDownFilled from 'fluentui-icons-svelte/ChevronDownFilled.svelte';
	import { selectDirection } from './dropdown-select.svelte.ts';
	import type { DropdownSelectProps } from './types.ts';

	let {
		hidePlaceholder,
		placeholder = 'Native Select Dropdown',
		ref = $bindable(),
		children,
		wrapperRef = $bindable(),
		wrapperProps,
		multiple,
		value = $bindable(multiple ? [] : ''),
		...attributes
	}: DropdownSelectProps = $props();
</script>

<div class="fs-dropdown" bind:this={wrapperRef} {...wrapperProps}>
	{#if !multiple}
		<ChevronDownFilled class="indicator" />
	{/if}
	<!-- 
		Due to svelte limitation: "'multiple' attribute must be static if select uses two-way binding"...
		We need to use a if block with the same structure 
	-->
	{#if multiple}
		<select
			class="fs-dropdown-select"
			{@attach selectDirection()}
			multiple
			bind:value
			bind:this={ref}
			{...attributes}
		>
			<button>
				<selectedcontent></selectedcontent>
			</button>
			{#if !hidePlaceholder}
				<option class="fs-dropdown-placeholder" disabled selected hidden value="">{placeholder}</option>
			{/if}
			{@render children?.()}
		</select>
	{:else}
		<select
			class="fs-dropdown-select"
			{@attach selectDirection()}
			bind:value
			bind:this={ref}
			{...attributes}
		>
			<button>
				<selectedcontent></selectedcontent>
			</button>
			{#if !hidePlaceholder}
				<option class="fs-dropdown-placeholder" disabled selected hidden value="">{placeholder}</option>
			{/if}
			{@render children?.()}
		</select>
	{/if}
</div>

<style>
	.fs-dropdown {
		display: flex;
		align-items: center;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-fill-default);
		min-width: 10rem;
		&:before {
			content: '';
			pointer-events: none;
			width: calc(100%);
			height: calc(100%);
			position: absolute;
			top: 0;
			left: 0;
			padding: 0.05rem;
			border-radius: 0.313rem;
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			mask-composite: exclude;
			background: var(--fs-elevation-text-border);
			z-index: 1;
		}
		&:after {
			content: '';
			pointer-events: none;
			width: 0;
			height: 10px;
			border-radius: 0px 0px 5px 5px;
			position: absolute;
			bottom: -0.063rem;
			left: calc(50% - 0.063rem);
			clip-path: polygon(0 75%, 100% 75%, 100% 100%, 0% 100%);
			background: transparent;
			transition:
				width var(--fs-normal-duration) var(--fs-point-to-point),
				left var(--fs-normal-duration) var(--fs-point-to-point);
			z-index: 2;
		}
		&:has(:focus-visible, :focus-within):after,
		&:has(:open):after {
			width: calc(100%);
			left: 0;
			background-color: var(--fs-accent-fill-default);
		}
		& .fs-dropdown-select {
			border-radius: 0;
			background: unset;
			appearance: base-select;
			width: 100%;
			height: 100%;
			padding: 0.25rem 2.2rem 0.25rem 0.8rem;
			border: none;
			font-size: var(--fs-body-font-size);
			color: var(--fs-text-secondary);
			cursor: pointer;
			outline: none;
			&::-ms-expand {
				display: none;
			}
			&:has(option:checked:not(.fs-dropdown-placeholder)) {
				color: var(--fs-text-primary);
			}
			&,
			&::picker(select) {
				appearance: base-select;
			}
			&::picker(select) {
				padding: 0.3rem;
				min-height: max-content;
				border-radius: 0 0 var(--fs-control-border-radius) var(--fs-control-border-radius);
				border: 1px solid var(--fs-control-surface-stroke-flyout);
				background: var(--fs-acrylic-background-default);
				box-shadow: var(--fs-shadow-card);
			}
			&::picker-icon {
				display: none;
			}
			&[multiple] {
				padding: 0.3rem;
			}
			&:global(.popover-up)::picker(select) {
				border-radius: var(--fs-control-border-radius) var(--fs-control-border-radius) 0 0;
			}
		}
		&:global(:has(.open.popover-up):not(:has([multiple])))::before {
			border-radius: 0 0 var(--fs-control-border-radius) var(--fs-control-border-radius);
		}
		&:global(:has(.open):not(:has(.popover-up, [multiple])))::before {
			border-radius: var(--fs-control-border-radius) var(--fs-control-border-radius) 0 0;
		}
		&:global(:has(.open):not(:has(.popover-up, [multiple])))::after {
			border-radius: 0;
		}
		& selectedcontent :global(:has(.value-text) :not(.value-text)),
		& selectedcontent :global(.checkmark) {
			display: none;
		}
		&:global(:has(.fs-dropdown-select-option:checked) .fs-dropdown-select-option:not(:checked) .option-content) {
			/* Calc padding + checkmark width + gap */
			padding: 0.275rem 0.5rem 0.4rem calc(0.5rem + 1rem + 0.5rem);
		}
		& :global(.indicator) {
			width: 1rem;
			position: absolute;
			right: 0.6rem;
			pointer-events: none;
			color: var(--fs-text-secondary);
		}
		& :global(select:-internal-list-box:focus option:checked) {
			background: red !important;
		}
	}
</style>
