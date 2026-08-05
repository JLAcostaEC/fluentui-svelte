<script lang="ts">
	import Button from './button.svelte';
	import ChevronDownFilled from 'fluentui-icons-svelte/ChevronDownFilled.svelte';
	import type { SplitButtonProps } from './types.ts';

	let {
		class: classes,
		appearance = 'accent',
		shape = 'rounded',
		disabled = false,
		wrapperRef = $bindable(),
		primaryButtonProps,
		menuTriggerProps,
		primaryButtonRef = $bindable(),
		menuTriggerRef = $bindable(),
		children,
		...attributes
	}: SplitButtonProps = $props();
</script>

<div class={['fs-split-button', classes]} role="group" bind:this={wrapperRef} {...attributes}>
	<Button as="button" {appearance} {shape} {disabled} bind:ref={primaryButtonRef} {...primaryButtonProps}>
		{#if children}
			{@render children()}
		{:else}
			{appearance[0].toUpperCase() + appearance.slice(1) + ' Button'}
		{/if}
	</Button>
	<Button
		as="button"
		class="menu-button"
		{appearance}
		{shape}
		{disabled}
		bind:ref={menuTriggerRef}
		{...menuTriggerProps}
	>
		<ChevronDownFilled class="indicator" />
	</Button>
</div>

<style>
	.fs-split-button {
		display: inline-flex;
		align-items: stretch;
		& :global(:first-child) {
			border-top-right-radius: 0 !important;
			border-bottom-right-radius: 0 !important;
			z-index: 1;
		}
		& :global(:last-child) {
			z-index: 0;
			border-top-left-radius: 0 !important;
			border-bottom-left-radius: 0 !important;
			margin-left: -1px;
			&::after {
				padding-left: 0;
			}
		}
		& :global(svg.indicator) {
			width: 1rem;
			margin: 0;
			pointer-events: none;
		}
	}
</style>
