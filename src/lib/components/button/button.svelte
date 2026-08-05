<script lang="ts" generics="T extends ButtonGenerics = 'button'">
	import { invokeHandlers, RenderSoC } from '$internal';
	import ChevronDownFilled from 'fluentui-icons-svelte/ChevronDownFilled.svelte';
	import type { ButtonGenerics, ButtonProps } from './types.ts';

	let {
		as = 'button' as T,
		appearance = 'accent',
		class: classes,
		shape = 'rounded',
		disabled,
		ref = $bindable(),
		onclick,
		onkeydown,
		isMenuButton,
		indicatorPosition = 'after',
		indicatorIcon,
		disabledFocusable = false,
		tabindex: _tabIndex,
		children,
		...attributes
	}: ButtonProps<T> = $props();

	// svelte-ignore state_referenced_locally
	if (as !== 'button' && as !== 'a' && as !== 'div') {
		throw new Error(`Invalid 'as' prop value: ${as}. Expected 'button', 'a', or 'div'.`);
	}

	const tabIndex = $derived(as === 'div' ? 0 : undefined);
</script>

<!-- 
	@component
	A button triggers an action or event when activated and supports three visual appearances (accent, standar & subtle).
	- Usage:
    ```tsx
    <script>
      import { Button } from 'fluentui-svelte';
    </script>

    <Button>Click me!</Button>
    <Button as="a">I'm an Anchor!</Button>
    <Button appearance="standard" disabled>You can't click me!</Button>
    ```
 -->
<svelte:element
	this={as}
	bind:this={ref}
	disabled={disabled && as !== 'div' ? true : undefined}
	aria-disabled={disabled && as !== 'div' ? true : undefined}
	class={['fs-button', shape, appearance, classes]}
	tabindex={_tabIndex ?? (as !== 'div' ? (disabledFocusable || disabled ? -1 : tabIndex) : undefined)}
	onclick={(e: MouseEvent) => invokeHandlers(e, disabled, [onclick])}
	onkeydown={(e: KeyboardEvent) => invokeHandlers(e, [as === 'div', disabled], [onkeydown])}
	{...attributes}
>
	{#if isMenuButton && indicatorPosition === 'before'}
		{#if indicatorIcon}
			<RenderSoC SoC={indicatorIcon} class="indicator" args={[{ class: 'indicator' }]} />
		{:else}
			<ChevronDownFilled class="indicator" />
		{/if}
	{/if}

	{#if children}
		{@render children()}
	{:else}
		{appearance[0].toUpperCase() + appearance.slice(1) + ' Button'}
	{/if}

	{#if isMenuButton && indicatorPosition === 'after'}
		{#if indicatorIcon}
			<RenderSoC SoC={indicatorIcon} class="indicator" args={[{ class: 'indicator' }]} />
		{:else}
			<ChevronDownFilled class="indicator" />
		{/if}
	{/if}
</svelte:element>

<style>
	.fs-button {
		border-radius: var(--fs-control-border-radius);
		font-size: var(--fs-body-font-size);
		line-height: var(--fs-body-line-height);
		color: var(--fs-text-primary);
		background: transparent;
		border: none;
		padding: 0.375rem 0.813rem 0.5rem 0.813rem;
		cursor: pointer;
		position: relative;
		outline: none;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		text-align: center;
		justify-content: center;
		user-select: none;
		&:not([type])[href] {
			text-decoration: none;
		}
		&:disabled,
		&[disabled] {
			cursor: not-allowed;
		}
		&:not(.subtle):after {
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
		&:focus-visible {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.063rem;
		}
		& :global(svg.indicator) {
			width: 1rem;
			height: auto;
			pointer-events: none;
		}
	}
	.fs-button.accent {
		color: var(--fs-text-on-accent-primary);
		background: var(--fs-accent-fill-default);
		&::after {
			background: var(--fs-elevation-accent-control-border);
		}
		&:hover {
			background: var(--fs-accent-fill-secondary);
			&::after {
				background: var(--fs-elevation-accent-control-border);
			}
		}
		&:active {
			color: var(--fs-text-on-accent-secondary);
			&::after {
				background: var(--fs-control-stroke-on-accent-default);
			}
		}
		&:disabled,
		&[disabled] {
			background: var(--fs-accent-fill-disabled) !important;
			color: var(--fs-text-on-accent-disabled) !important;
			&::after {
				background: var(--fs-elevation-accent-control-disabled) !important;
			}
		}
	}
	.fs-button.standard {
		background: var(--fs-control-fill-default);
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
		&[disabled] {
			background: var(--fs-control-fill-disabled) !important;
			color: var(--fs-text-disabled) !important;
			&::after {
				background: var(--fs-control-stroke-default) !important;
			}
		}
	}
	.fs-button.subtle {
		&::after {
			background: var(--fs-control-fill-transparent);
		}
		&:hover {
			background: var(--fs-subtle-fill-secondary);
		}
		&:active {
			color: var(--fs-text-tertiary);
			background: var(--fs-subtle-fill-tertiary);
			&::after {
				background: var(--fs-control-stroke-default);
			}
		}
		&:disabled,
		&[disabled] {
			background: var(--fs-subtle-fill-transparent) !important;
			color: var(--fs-text-disabled) !important;
		}
	}
	.fs-button.rounded {
		border-radius: var(--fs-control-border-radius);
	}
	.fs-button.circular {
		border-radius: 50vw;
	}
	.fs-button.square {
		border-radius: 0;
	}
</style>
