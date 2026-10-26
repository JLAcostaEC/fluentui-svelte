<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import CheckmarkFilled from 'fluentui-icons-svelte/CheckmarkFilled.svelte';
	import SubtractFilled from 'fluentui-icons-svelte/SubtractFilled.svelte';
	import { PREFIX } from '$constants';
	import type { CheckboxProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'checkbox';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	const labelContext = claimLabel(() => id);

	let {
		ref = $bindable(),
		wrapperRef = $bindable(),
		checked = $bindable(),
		indeterminate = $bindable(),
		id = labelContext?.fieldId ?? ID,
		name = id,
		'aria-hidden': ariaHidden,
		disabled,
		wrapperAttributes,
		children,
		...attributes
	}: CheckboxProps = $props();
</script>

<!-- 
	@component
  The Fluent UI Checkbox is a customizable input element that allows users to select one or more options from a set.
  It is designed to be consistent with the Fluent Design System.

	If a `name` attribute isn't passed, `id` attribute will be used instead. If `name` & `id` aren't passed, the component will generate one and apply it to both.

  - Usage:
  ```tsx
  <script>
    import { Checkbox } from 'fluentui-svelte';
  </script>

  <Checkbox>Checkbox label</Checkbox>
  ```
 -->

<div {...wrapperAttributes} class={['fs-checkbox', wrapperAttributes?.class]} bind:this={wrapperRef}>
	<input
		{...attributes}
		{id}
		{name}
		{disabled}
		type="checkbox"
		aria-hidden={ariaHidden}
		bind:checked
		bind:this={ref}
		{indeterminate}
	/>
	<div style="pointer-events: none;" aria-hidden="true">
		<SubtractFilled class="indeterminate" />
		<CheckmarkFilled class="checked" />
	</div>
	<!-- Inside a Label, the Label names the field instead. -->
	{#if children && !labelContext}
		<label for={id}>{@render children()}</label>
	{/if}
</div>

<style>
	.fs-checkbox {
		display: inline-flex;
		align-items: center;
		border-radius: 0.25rem;
		outline: none;
		cursor: pointer;
		position: relative;
		&:has(input:focus-visible) {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.125rem;
			&:has(> label) {
				border-radius: 0.063rem;
				outline-offset: 0.313rem;
			}
		}
		&:hover div {
			background-color: var(--fs-control-alt-fill-tertiary);
		}
		&:has(input:active) div {
			background-color: var(--fs-control-alt-fill-quaternary);
			border-color: var(--fs-control-strong-disabled);
		}
		& > label {
			padding-inline-start: 0.75rem;
			cursor: inherit;
		}
		& input {
			position: absolute;
			inset: 0;
			width: 1.25rem;
			margin: 0;
			border: unset;
			outline: 0 !important;
			opacity: 0;
			appearance: none;
			-webkit-appearance: none;
			-moz-appearance: none;
			&:indeterminate + div :global(svg.indeterminate),
			&:checked + div :global(svg.checked) {
				mask-size: 100% 100%;
				transition: var(--fs-slower-duration, 1s) cubic-bezier(0.55, 0, 0, 1) mask-size;
			}
			&:is(:checked, :indeterminate) {
				& + div {
					background-color: var(--fs-accent-fill-default);
					border-color: var(--fs-accent-fill-default);
					& :global(svg.indeterminate),
					& :global(svg.checked) {
						height: auto;
						& :global(path) {
							fill: var(--fs-text-on-accent-primary);
						}
					}
				}
				&:hover {
					& + div {
						background-color: var(--fs-accent-fill-secondary);
						border-color: var(--fs-accent-fill-secondary);
					}
					&:active + div {
						background-color: var(--fs-accent-fill-tertiary);
						border-color: var(--fs-accent-fill-tertiary);
					}
				}
			}
			&:checked + div :global(svg.checked) {
				width: 1rem;
			}
			&:is(:user-invalid, [aria-invalid='true']) {
				& + div {
					border-color: var(--fs-system-critical);
					color: var(--fs-system-critical) !important;
					& + label {
						color: var(--fs-system-critical);
					}
				}
				&:hover {
					& + div {
						border-color: var(--fs-system-critical);
					}
				}
			}
			&:indeterminate + div :global(svg.indeterminate) {
				width: 0.8rem;
			}
		}
		& div {
			position: relative;
			width: 1.25rem;
			height: 1.25rem;
			border: 1px solid var(--fs-control-strong-stroke-default);
			border-radius: var(--fs-control-border-radius);
			background-color: var(--fs-control-alt-fill-secondary);
			display: flex;
			align-items: center;
			justify-content: center;
			& :global(svg) {
				width: 0;
				transform-origin: 80% 20%;
				mask-image: linear-gradient(black, black);
				mask-repeat: no-repeat;
				mask-size: 0% 100%;
				& :global(path) {
					fill: var(--fs-text-on-accent-primary);
				}
			}
		}
		&:has(input:disabled) {
			pointer-events: none;
			color: var(--fs-text-disabled);
			& input + div {
				background-color: var(--fs-control-alt-fill-disabled);
				border-color: var(--fs-control-strong-stroke-disabled);
			}
			& input:checked + div,
			& input:indeterminate + div {
				background-color: var(--fs-accent-fill-disabled);
				border-color: var(--fs-control-fill-transparent);
			}
			& :global(svg path) {
				fill: var(--fs-text-on-accent-disabled);
			}
		}
	}
</style>
