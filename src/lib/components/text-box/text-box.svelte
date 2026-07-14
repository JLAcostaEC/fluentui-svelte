<script lang="ts">
	import DismissFilled from 'fluentui-icons-svelte/DismissFilled.svelte';
	import SearchFilled from 'fluentui-icons-svelte/SearchFilled.svelte';
	import EyeShowFilled from 'fluentui-icons-svelte/EyeShowFilled.svelte';
	import EyeHideFilled from 'fluentui-icons-svelte/EyeHideFilled.svelte';
	import { TextBoxButton } from '$lib/index.js';
	import { RenderSoC } from '$internal';
	import type { FSInput } from './types.ts';

	const FALLBACK_ID = $props.id();

	let {
		id = 'input-' + FALLBACK_ID,
		readonly,
		name = id,
		hideActionButtons,
		type = 'text',
		class: classes,
		wrapperAttributes,
		wrapperRef = $bindable(),
		value = $bindable(),
		ref = $bindable(),
		placeholder = 'Fluent TextBox',
		size = 'medium',
		contentBefore,
		contentAfter,
		querySubmitted,
		textChanged,
		onkeydown,
		onClear,
		children,
		...attributes
	}: FSInput = $props();

	let currentType = $derived(type);

	const clearInput = (e: MouseEvent) => {
		if (typeof value === 'string') {
			value = '';
			if (type === 'password' && currentType === 'text') {
				ref?.setAttribute('type', 'password');
				currentType = 'password';
				ref?.focus();
			}
		} else {
			value = 0;
		}
		onClear?.(e);
	};

	const revealPassword = () => {
		if (ref) {
			ref.setAttribute('type', currentType === 'password' ? 'text' : 'password');
			currentType = currentType === 'password' ? 'text' : 'password';
			ref.focus();
		}
	};

	const handleKeyDown = (e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			(e.target as HTMLInputElement).blur();
		}
		onkeydown?.(e);
	};
</script>

<!-- 
@component

This is a implementation of Fluent UI TextBox component. The TextBox component is a customizable input element that allows users to enter text. It is designed to be consistent with the Fluent Design System.

- Usage:
  ```tsx
  <script>
    import { TextBox } from 'fluentui-svelte';
  </script>

  <TextBox type="text" placeholder="Enter your name" />
  ```
-->
<div class="fs-textbox {id} text-box-size-{size} {classes}" {...wrapperAttributes} bind:this={wrapperRef}>
	{#if contentBefore}
		<span class="content-before">
			{#if typeof contentBefore === 'string'}
				{contentBefore}
			{:else}
				<RenderSoC SoC={contentBefore} />
			{/if}
		</span>
	{/if}
	<input
		{type}
		{id}
		{name}
		{placeholder}
		{readonly}
		bind:value
		bind:this={ref}
		onkeyup={handleKeyDown}
		oninput={(e) => textChanged?.(e as any, value)}
		onchange={(e) => textChanged?.(e as any, value)}
		{...attributes}
	/>
	{#if contentAfter}
		<span class="content-after">
			{#if typeof contentAfter === 'string'}
				{contentAfter}
			{:else}
				<RenderSoC SoC={contentAfter} />
			{/if}
		</span>
	{/if}
	{#if !hideActionButtons}
		{#if ((value && value.length > 0) || (typeof value === 'number' && value !== 0)) && !readonly}
			<TextBoxButton class="clear-button" disabled={readonly} aria-label="Delete Text" onclick={(e) => clearInput(e)}>
				<DismissFilled />
			</TextBoxButton>
		{/if}
		{#if type === 'search'}
			<TextBoxButton disabled={readonly} aria-label="Search" onclick={(e) => querySubmitted?.(e, value)}>
				<SearchFilled />
			</TextBoxButton>
		{:else if type === 'password'}
			<TextBoxButton disabled={readonly} aria-label="Reveal Password" onclick={() => revealPassword()}>
				{#if currentType === 'password'}
					<EyeShowFilled />
				{:else}
					<EyeHideFilled />
				{/if}
			</TextBoxButton>
		{/if}
	{/if}
	{@render children?.()}
</div>

<style>
	.fs-textbox {
		display: flex;
		align-items: center;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-fill-default);
		border: none;
		& input {
			appearance: none;
			background: transparent;
			outline: none;
			border: none;
			margin: 0;
			z-index: 1;
			color: var(--fs-text-primary);
			padding: 0.375rem 0.75rem;
			min-width: 2ch;
			flex: 1 1 auto;
			&::placeholder {
				color: var(--fs-text-secondary);
			}
			&::-ms-reveal,
			&::-ms-clear {
				display: none;
			}
			&::-webkit-search-decoration,
			&::-webkit-search-cancel-button,
			&::-webkit-search-results-button,
			&::-webkit-search-results-decoration,
			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
			}
			&[type='number'] {
				-moz-appearance: textfield;
				appearance: textfield;
			}
		}
		&:before {
			content: '';
			pointer-events: none;
			width: calc(100% + 0.125rem);
			height: calc(100% + 0.125rem);
			position: absolute;
			top: -0.063rem;
			left: -0.063rem;
			padding: 0.063rem;
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
		&:hover {
			background: var(--fs-control-fill-secondary);
		}
		&:has(input:focus-visible):after {
			width: calc(100% + 0.125rem);
			left: -0.063rem;
			background-color: var(--fs-accent-fill-default);
		}
		&:has(input:focus) {
			background: var(--fs-control-fill-input-active);
			& input::placeholder {
				color: var(--fs-text-tertiary);
			}
		}
		&:has(input:disabled) {
			cursor: not-allowed;
			background: var(--fs-control-fill-disabled);
			& input::placeholder {
				color: var(--fs-text-disabled);
			}
			&::before {
				background: var(--fs-control-stroke-default);
			}
		}
		&:has(.content-before, .content-after) {
			& input {
				padding: 0.375rem 0.25rem;
			}
			& .content-before {
				padding: 0.375rem 0.25rem 0.375rem 0.625rem;
			}
			& .content-after {
				padding: 0.375rem 0.625rem 0.375rem 0.25rem;
			}
		}
		& .content-before,
		& .content-after {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--fs-text-secondary);
			height: 100%;
			min-width: max-content;
			width: auto;

			& :global(svg) {
				fill: currentColor;
				width: auto;
				height: 100%;
				& :global(path) {
					fill: currentColor;
				}
			}
		}
		&.text-box-size-small {
			& :is(input, .content-after, .content-before) {
				font-size: var(--fs-body2-font-size);
				padding: 0.25rem;
			}
		}
		&.text-box-size-medium {
			font-size: var(--fs-body-font-size);
			& :is(input, .content-after, .content-before) {
				padding: 0.375rem;
				font-size: var(--fs-body-font-size);
			}
		}
		&.text-box-size-large {
			& :is(input, .content-after, .content-before) {
				padding: 0.625rem 0.625rem;
				font-size: var(--fs-subtitle2-font-size);
			}
			& :is(.content-after, .content-before) {
				font-size: var(--fs-body-font-size);
			}
			& :global(.clear-button:last-of-type) {
				margin-right: 0.3125rem;
			}
		}
	}
</style>
