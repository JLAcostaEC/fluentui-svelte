<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		element = $bindable(),
		type = 'button',
		children,
		...attributes
	}: { element?: HTMLButtonElement; children: Snippet } & HTMLButtonAttributes = $props();
</script>

<button {type} bind:this={element} {...attributes}>
	{@render children?.()}
</button>

<style>
	button {
		outline: none;
		background-color: var(--fs-subtle-fill-transparent);
		border: 1px solid var(--fs-subtle-fill-transparent);
		border-radius: var(--fs-control-border-radius);
		color: var(--fs-text-secondary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.188rem 0.313rem;
		z-index: 1;
		flex: 0 0 auto;
		margin: 0 0.375rem;
		&:first-of-type {
			margin-left: 0;
		}
		&:last-of-type {
			margin-right: 0.188rem;
		}
		&:focus-visible {
			outline: 0.125rem solid var(--fs-focus-stroke-outer);
			outline-offset: 1px;
		}
		&:hover {
			background-color: var(--fs-subtle-fill-secondary);
		}
		&:active {
			background-color: var(--fs-subtle-fill-tertiary);
			color: var(--fs-text-secondary);
		}
		&:disabled {
			background-color: var(--fs-subtle-fill-disabled);
			border-color: var(--fs-control-stroke-default);
			color: var(--fs-text-disabled);
			cursor: not-allowed;
		}
		& :global(svg) {
			pointer-events: none;
			fill: currentColor;
			width: 1.1rem;
			height: 1.1rem;
			& :global(path) {
				fill: currentColor;
			}
		}
	}
</style>
