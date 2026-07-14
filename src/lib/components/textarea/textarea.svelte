<script lang="ts">
	import { PREFIX } from '$constants';
	import { invokeHandlers } from '$internal';
	import type { TextAreaProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'textarea';
	const ID = `${PREFIX}${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		id = ID,
		name = id,
		value = $bindable(''),
		ref = $bindable(),
		resize = 'vertical',
		style,
		wrapperAttributes,
		onchange,
		disabled = false,
		wrapperRef = $bindable(),
		...attributes
	}: TextAreaProps = $props();
</script>

<!-- 
	@component
	A textarea allows users to enter and edit multi-line text. It supports resizing, placeholder text, and disabled/read-only states.

	- Usage:
	```tsx
	<script>
		import { TextArea } from 'fluentui-svelte';
	</script>

	<TextArea placeholder="Enter text..." />
	<TextArea resize="none" disabled />
	```
-->
<div class="fs-textarea" {...wrapperAttributes} bind:this={wrapperRef}>
	<textarea
		{name}
		{id}
		onchange={(e) => invokeHandlers(e, [disabled], [onchange])}
		style="resize: {resize}; {style}"
		bind:this={ref}
		bind:value
		{...attributes}></textarea>
</div>

<style>
	.fs-textarea {
		display: flex;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-fill-default);
		border: none;
		max-width: 100%;
		width: fit-content;
		& textarea {
			appearance: none;
			background: transparent;
			outline: none;
			border: none;
			margin: 0;
			z-index: 1;
			color: var(--fs-text-primary);
			padding: 0.375rem 0.625rem;
			min-height: 100px;
			min-width: 250px;
			flex-basis: fill;
			/* Only for Edge, Chrome */
			field-sizing: content;
			&::placeholder {
				color: var(--fs-text-secondary);
			}
			&:read-only {
				color: var(--fs-text-secondary);
				resize: none !important;
			}
			&::-ms-reveal,
			&::-ms-clear {
				display: none;
			}
			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
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
			border-radius: 5px;
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
				width var(--fs-fast-duration) var(--fs-point-to-point),
				left var(--fs-fast-duration) var(--fs-point-to-point);
			z-index: 2;
		}
		&:hover {
			background: var(--fs-control-fill-secondary);
		}
		&:has(textarea:focus-visible):after {
			width: calc(100% + 0.125rem);
			left: -0.063rem;
			background: var(--fs-accent-fill-default);
		}
		&:has(textarea:focus) {
			background: var(--fs-control-fill-input-active);
			& textarea::placeholder {
				color: var(--fs-text-tertiary);
			}
		}
		&:has(textarea:disabled) {
			background: var(--fs-control-fill-disabled);
			& textarea {
				cursor: not-allowed;
				resize: none;
			}
			& textarea::placeholder {
				color: var(--fs-text-disabled);
			}
			&::before {
				background: var(--fs-control-stroke-default);
			}
		}
	}
</style>
