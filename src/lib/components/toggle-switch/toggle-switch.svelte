<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import { PREFIX } from '$constants';
	import type { ToggleSwitchProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'toggle-switch';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	const labelContext = claimLabel(() => id);

	let {
		ref = $bindable(null),
		checked = $bindable(null),
		id = labelContext?.fieldId ?? ID,
		name = id,
		label,
		wrapperAttributes,
		wrapperRef = $bindable(null),
		...attributes
	}: ToggleSwitchProps = $props();
</script>

<!-- 
	@component

  This file contains the Svelte component implementation of a Fluent UI Toggle Switch.
  The Fluent UI Toggle Switch is a customizable input element that allows users to switch between two states.

  - Usage:
  ```tsx
  <script>
    import { ToggleSwitch } from 'fluentui-svelte';
  </script>

  <ToggleSwitch label="Toggle Switch" />
  ```
-->
<div {...wrapperAttributes} class={['fs-toggle-switch', wrapperAttributes?.class]} bind:this={wrapperRef}>
	<input {...attributes} type="checkbox" role="switch" {id} {name} bind:checked bind:this={ref} />
	<!-- Inside a Label, the Label names the field instead. -->
	{#if label && !labelContext}
		<label for={id}>
			{label}
		</label>
	{/if}
</div>

<style>
	.fs-toggle-switch {
		display: flex;
		align-items: center;
		border-radius: 1.125rem;
		outline: none;
		cursor: pointer;
		user-select: none;
		&:has(input:focus-visible) {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.125rem;
			&:has(> label) {
				border-radius: 0.063rem;
				outline-offset: 0.313rem;
			}
		}
		&:hover input {
			background-color: var(--fs-control-alt-fill-tertiary);
			&::after {
				transform: translateX(0) scale(1.16);
			}
			&:checked::after {
				transform: translateX(1.25rem) scale(1.16);
			}
		}
		&:active input {
			background-color: var(--fs-control-alt-fill-quaternary);
			&::after {
				width: 1rem;
			}
			&:checked {
				background-color: var(--fs-accent-fill-secondary);
				border-color: var(--fs-control-fill-transparent);
				&::after {
					margin-left: calc(-0.25rem * 1.16);
				}
			}
		}
		&:has(input:disabled) {
			pointer-events: none;
			color: var(--fs-text-disabled);
			& input {
				background-color: var(--fs-control-alt-fill-disabled);
				border-color: var(--fs-control-strong-stroke-disabled);
				&:checked {
					background-clip: padding-box;
					background-color: var(--fs-accent-fill-disabled);
					border-color: var(--fs-accent-fill-disabled);
					&::after {
						background-color: var(--fs-text-on-accent-disabled);
					}
				}
			}
			& input::after {
				background-color: var(--fs-text-disabled);
			}
		}
		& input {
			appearance: none;
			display: flex;
			align-items: center;
			position: relative;
			outline: none;
			width: 2.5rem;
			min-width: 2.5rem;
			height: 1.25rem;
			border: 0.063rem solid var(--fs-control-strong-stroke-default);
			border-radius: 1.125rem;
			background-color: var(--fs-control-alt-fill-secondary);
			padding: 0.063rem;
			cursor: pointer;
			&::after {
				content: '';
				position: absolute;
				left: 0.22rem;
				width: 0.75rem;
				height: 0.75rem;
				border-radius: 0.75rem;
				background-color: var(--fs-text-secondary);
				transition:
					transform var(--fs-fast-duration) var(--fs-point-to-point),
					width var(--fs-fast-duration),
					margin var(--fs-fast-duration);
			}
			/* Add effects support for Keyboard Events */
			&:active::after {
				width: 1rem;
			}
			&:is(:user-invalid, [aria-invalid='true']) {
				border-color: var(--fs-system-critical);
			}
			&:checked {
				background-color: var(--fs-accent-fill-default);
				border-color: var(--fs-accent-fill-default);
				&::after {
					transform: translateX(1.25rem);
					background-color: var(--fs-text-on-accent-primary);
				}
				&:active::after {
					margin-left: calc(-0.25rem * 1.16);
				}
			}
		}
		& > label {
			flex-grow: 1;
			cursor: pointer;
			font-size: inherit;
			color: inherit;
			padding-inline: 0.8rem;
		}
	}
</style>
