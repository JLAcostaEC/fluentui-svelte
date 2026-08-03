<script lang="ts">
	import { PREFIX } from '$constants';
	import type { RadioButtonProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'radio-button';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		ref = $bindable(),
		group = $bindable(undefined),
		id = ID,
		label,
		name = id,
		value,
		checked = $bindable(false),
		labelAttributes,
		...attributes
	}: RadioButtonProps = $props();
</script>

<!-- 
	@component

  This file contains the Svelte component implementation of a Fluent UI Radio Button.
  The Fluent UI Radio Button is a customizable input element that allows users to select one option from a set.

	If a `name` attribute isn't passed, `id` attribute will be used instead. If `name` & `id` aren't passed, the component will generate one and apply it to both.

  - Usage:
  ```tsx
  <script>
    import { RadioButton } from 'fluentui-svelte';
  </script>

  <RadioButton label="Radio Button label" />
  ```
 -->

<label class="fs-radio-button" {...labelAttributes}>
	<input type="radio" {id} {name} {value} {checked} bind:this={ref} bind:group {...attributes} />
	{#if label}
		<span>{label}</span>
	{/if}
</label>

<style>
	.fs-radio-button {
		display: flex;
		align-items: center;
		border-radius: 1.125rem;
		& input {
			appearance: none;
			position: relative;
			border: 1px solid var(--fs-control-strong-default);
			border-radius: 50%;
			width: 1.125rem;
			height: 1.125rem;
			cursor: pointer;
			outline: none;
			background-color: var(--fs-control-alt-fill-secondary);
			&::after {
				content: '';
				position: absolute;
				width: 0.5rem;
				height: 0.5rem;
				inset: 0.25rem;
				border-radius: 50%;
				background-color: var(--fs-text-on-accent-primary);
				transition: transform 0.2s;
				transform: scale(0);
			}
			&:hover {
				border-color: var(--fs-control-strong-disabled);
				background-color: var(--fs-control-alt-fill-tertiary);
			}
			&:active {
				background-color: var(--fs-control-alt-fill-quaternary);
				&::after {
					transform: scale(0.7);
				}
			}
			&:checked {
				border-color: transparent;
				background-color: var(--fs-accent-fill-default);
				&::after {
					transform: scale(1);
				}
				&:hover {
					border-color: transparent;
					background-color: var(--fs-accent-fill-secondary);
					&::after {
						transform: scale(1.3);
					}
				}
				&:active {
					background-color: var(--fs-accent-fill-tertiary);
					&::after {
						transform: scale(0.7);
					}
				}
			}
		}
		&:has(input:disabled) {
			pointer-events: none;
			color: var(--fs-text-disabled);
			input {
				background-color: var(--fs-control-alt-fill-disabled);
				border-color: var(--fs-control-strong-disabled);
				&::after {
					background-color: var(--fs-text-on-accent-disabled);
				}
			}
		}
		&:has(input:focus-visible) {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.125rem;
			&:has(span) {
				border-radius: 0.063rem;
				outline-offset: 0.313rem;
			}
		}
		& span {
			font-size: inherit;
			color: inherit;
			padding: 0px 0.75rem;
		}
	}
</style>
