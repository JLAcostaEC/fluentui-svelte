<script lang="ts" generics="Tag extends DividerGenerics = 'div'">
	import type { DividerProps, DividerGenerics } from './types.ts';

	let {
		as = 'div' as Tag,
		ref = $bindable(),
		vertical,
		alignContent = 'center',
		appearance = 'default',
		inset,
		children,
		...attributes
	}: DividerProps<Tag> = $props();
</script>

<!-- 
	@component
	A divider visually separates content into groups. It supports horizontal and vertical orientations, optional label content, and multiple appearances.

	- Usage:
	```tsx
	<script>
		import { Divider } from 'fluentui-svelte';
	</script>

	<Divider />
	<Divider appearance="accent">Section</Divider>
	<Divider vertical />
	```
-->
<svelte:element
	this={as}
	bind:this={ref}
	class:inset
	class:vertical
	role="separator"
	class="fs-divider {appearance} align-{alignContent}"
	style=" --divider-margin: {children ? (vertical ? '0.5rem' : '0.75rem') : '0'}"
	aria-orientation={vertical ? 'vertical' : 'horizontal'}
	{...attributes}
>
	{@render children?.()}
</svelte:element>

<style>
	.fs-divider {
		width: 100%;
		height: 1px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--fs-text-secondary);
		background: unset;
		border: unset;
		&::before,
		&::after {
			content: '';
			display: flex;
			flex: 1;
			background-color: var(--fs-control-strong-stroke-disabled);
			height: 1px;
			min-width: 0.5rem;
		}
		&::before {
			margin-right: var(--divider-margin);
		}
		&::after {
			margin-left: var(--divider-margin);
		}
		&.align-start::before {
			max-width: 0.5rem;
			max-height: 0.5rem;
		}
		&.align-end::after {
			max-width: 0.5rem;
			max-height: 0.5rem;
		}
		&.inset {
			padding-inline: 0.75rem;
		}
		&.vertical {
			flex-direction: column;
			width: max-content;
			height: inherit;
			&::before,
			&::after {
				width: 1px;
				min-width: 1px;
				height: calc((100% / 2) - var(--divider-margin));
				min-height: 0.5rem;
				margin-inline: 0;
			}
			&::before {
				margin-bottom: var(--divider-margin);
			}
			&::after {
				margin-top: var(--divider-margin);
			}
		}
		&.accent {
			color: var(--fs-accent-text-primary);
			&::before,
			&::after {
				background-color: var(--fs-accent-fill-default);
			}
		}
		&.subtle {
			color: var(--fs-text-disabled);
			&::before,
			&::after {
				background-color: var(--fs-control-stroke-secondary);
			}
		}
		&.strong {
			color: var(--fs-text-primary);
			&::before,
			&::after {
				background-color: var(--fs-control-strong-stroke-default);
			}
		}
	}
</style>
