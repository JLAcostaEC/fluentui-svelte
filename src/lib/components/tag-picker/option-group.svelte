<script lang="ts">
	import { PREFIX } from '$constants';
	import type { TagPickerOptionGroupProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const LABEL_ID = `${PREFIX}-tagpicker-group-${FALLBACK_ID}-label`;

	let { label, ref = $bindable(), class: classes, children, ...attributes }: TagPickerOptionGroupProps = $props();
</script>

<li class="fs-tagpicker-group" role="presentation">
	<span class="fs-tagpicker-group-label" id={LABEL_ID}>{label}</span>
	<ul bind:this={ref} class={classes} role="group" aria-labelledby={LABEL_ID} {...attributes}>
		{@render children?.()}
	</ul>
</li>

<style>
	.fs-tagpicker-group {
		list-style: none;
		/* A group left without an option on screen hides itself. */
		&:not(:has(:global(.fs-tagpicker-option))) {
			display: none;
		}
	}
	.fs-tagpicker-group-label {
		display: block;
		padding: 0.375rem 0.713rem;
		font-size: var(--fs-caption-font-size);
		font-weight: 600;
		color: var(--fs-text-secondary);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
