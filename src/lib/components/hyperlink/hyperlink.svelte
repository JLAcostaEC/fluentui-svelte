<script lang="ts">
	import type { HyperlinkProps } from './types.ts';

	let { href = '#', disabled, class: classes, children, ref = $bindable(), ...attributes }: HyperlinkProps = $props();
</script>

<!-- 
@component

This is an implementation of the Fluent UI hyperlink component. The hyperlink is used to navigate to a different page or to a different section of the same page. It is used to provide additional information or to redirect the user to another location.
F
- Usage:
```tsx
<script>
  import { Hyperlink } from 'fluentui-svelte';
</script>

<Hyperlink href="https://fluentui-svelte.dev">Fluent UI Svelte</Hyperlink>
```
-->
<a
	// eslint-disable-next-line svelte/no-navigation-without-resolve
	{href}
	class={['fs-hyperlink', classes, { disabled }]}
	tabindex={disabled ? -1 : undefined}
	aria-disabled={disabled || undefined}
	onclick={disabled ? (e) => e?.preventDefault() : undefined}
	bind:this={ref}
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else}
		{href}
	{/if}
</a>

<style>
	.fs-hyperlink {
		color: var(--fs-accent-text-primary);
		text-decoration: underline;
		outline: none;
		border-radius: 0.25rem;
		&:hover,
		&:active {
			text-decoration: none;
		}
		&:hover {
			color: var(--fs-accent-text-secondary);
		}
		&:active {
			color: var(--fs-accent-text-tertiary);
		}
		&:focus-visible {
			outline: 0.188rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.063rem;
		}
		&.disabled {
			color: var(--fs-text-disabled);
			&:hover {
				cursor: not-allowed;
				text-decoration: underline;
			}
		}
	}
</style>
