<script lang="ts">
	import { PREFIX } from '$constants';
	import type { ToggleSwitchProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'toggle-switch';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		ref = $bindable(),
		checked = $bindable(),
		id = ID,
		name = id,
		label,
		labelAttributes,
		labelElement,
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
<label class="fs-toggle-switch" {...labelAttributes} bind:this={labelElement}>
	<input type="checkbox" role="switch" {id} {name} bind:checked bind:this={ref} {...attributes} />
	{#if label}
		<span>
			{label}
		</span>
	{/if}
</label>

<style>
	label {
		display: flex;
		align-items: center;
		border-radius: 1.125rem;
		outline: none;
		cursor: pointer;
		user-select: none;
		&:has(input:focus-visible) {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.125rem;
			&:has(span) {
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
		& span {
			font-size: inherit;
			color: inherit;
			padding-inline: 0.8rem;
		}
	}
</style>
